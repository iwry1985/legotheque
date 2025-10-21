import dash
from dash import html, dcc
import dash_bootstrap_components as dbc
import plotly.express as px
import pandas as pd
from data import df


dash.register_page(__name__, path="/market", name="Marché secondaire")

# ================ clean data ==================
df_market = df.copy()

# check que les colonnes prix sont numériques
df_market["current_avg_price"] = pd.to_numeric(df_market["current_avg_price"], errors="coerce")
df_market["last_6_month_avg_price"] = pd.to_numeric(df_market["last_6_month_avg_price"], errors="coerce")

# supprime les sets qui n'ont pas de prix
df_market = df_market[df_market["current_avg_price"].notna() & (df_market["current_avg_price"] > 0)]

df_market["condition"] = df_market["condition"].str.lower().map({"new": "new", "used": "used"})

# Garde la ligne la plus récente pour chaque set+condition
df_market = (
    df_market.sort_values(["fk_set_id", "condition", "year"], ascending=[True, True, False])
             .drop_duplicates(subset=["fk_set_id", "condition"], keep="first")
)

# Séparation neuf / occasion
df_new = df_market[df_market["condition"].eq("new")]
df_used = df_market[df_market["condition"].eq("used")]

# ================ KPI ==================
kpi_new_avg   = round(df_new["current_avg_price"].mean(), 2) if not df_new.empty else None
kpi_used_avg  = round(df_used["current_avg_price"].mean(), 2) if not df_used.empty else None
kpi_new_last6 = round(df_new["last_6_month_avg_price"].mean(), 2) if not df_new.empty else None
kpi_used_last6= round(df_used["last_6_month_avg_price"].mean(), 2) if not df_used.empty else None

def evolution(current, last):
    if pd.isna(current) or pd.isna(last) or last == 0:
        return None
    return round(((current - last) / last) * 100, 2)

evol_new  = evolution(kpi_new_avg,  kpi_new_last6)
evol_used = evolution(kpi_used_avg, kpi_used_last6)

# ================ Tops ==================
def top_set(df_cond):
    if df_cond.empty:
        return None
    i = df_cond["current_avg_price"].idxmax()
    row = df_cond.loc[i, ["name", "current_avg_price", "condition", "year"]]
    return dict(
        name=row["name"],
        price=float(row["current_avg_price"]),
        condition=row["condition"],
        year=int(row["year"])
    )


top_new  = top_set(df_new)
top_used = top_set(df_used)

def kpi_card(title, value, sub=None):
    return dbc.Card([
        dbc.CardHeader(title, className="fw-bold text-center"),
        dbc.CardBody([
            html.H4(f"{value}", className="text-center mb-0"),
            html.Small(sub or "", className="text-muted text-center d-block")
        ])
    ], color="light", outline=True, style={"textAlign": "center"})

kpis = dbc.Row([
    dbc.Col(kpi_card("Prix moyen NEUF", f"{kpi_new_avg} €" if kpi_new_avg else "—",
                     f"{evol_new}% vs 6 mois" if evol_new is not None else "—")),
    dbc.Col(kpi_card("Prix moyen OCCASION", f"{kpi_used_avg} €" if kpi_used_avg else "—",
                     f"{evol_used}% vs 6 mois" if evol_used is not None else "—")),
    dbc.Col(kpi_card(
        "Top NEUF",
        top_new["name"] if top_new else "—",
        f"{top_new['price']} € ({top_new['year']})" if top_new else ""
    )),
    dbc.Col(kpi_card(
        "Top OCCASION",
        top_used["name"] if top_used else "—",
        f"{top_used['price']} € ({top_used['year']})" if top_used else ""
    )),
], className="mb-5 justify-content-center")



# ================ GRAPH 1 : Comparatif par thème ==================
# calcule le prix moyen par groupe de thème et condition
price_by_theme = (
    df_market.groupby(["theme_group", "condition"], as_index=False)["current_avg_price"]
    .mean()
)

top_themes = (
    df_market["theme_group"]
    .value_counts()
    .nlargest(12)
    .index
)
price_by_theme = price_by_theme[price_by_theme["theme_group"].isin(top_themes)]


fig_theme_price = px.bar(
    price_by_theme,
    x="theme_group",
    y="current_avg_price",
    color="condition",
    barmode="group",
    title="Prix moyen par groupe de thèmes (NEUF vs OCCASION)",
    labels={
        "theme_group": "Groupe de thème",
        "current_avg_price": "Prix moyen (€)",
        "condition": "Condition"
    },
    color_discrete_map={"new": "#EAB308", "used": "#575757"} 
)

fig_theme_price.update_layout(
    template="plotly_white",
    font=dict(family="Inter, sans-serif", size=13),
    title_font=dict(family="Lilita One", size=18, color="#333"),
    margin=dict(l=40, r=20, t=60, b=40),
    xaxis_tickangle=-30,
    legend_title_text=""
)


# ================ GRAPH 2 : Corrélation prix / pièces ==================
df_scatter = df_market[
    df_market["pieces"].notna() &
    (df_market["pieces"] > 0) &
    df_market["current_avg_price"].notna() &
    (df_market["current_avg_price"] > 0)
]

fig_scatter_market = px.scatter(
    df_scatter,
    x="pieces",
    y="current_avg_price",
    color="condition", 
    size="current_avg_price",
    hover_data=["name", "theme_group", "condition"],
    title="Corrélation entre le prix et le nombre de pièces (marché secondaire)",
    labels={
        "pieces": "Nombre de pièces",
        "current_avg_price": "Prix moyen (€)",
        "condition": "Condition"
    },
    color_discrete_map={"new": "#EAB308", "used": "#575757"}
)

fig_scatter_market.update_traces(marker=dict(opacity=0.7, line=dict(width=0)))

fig_scatter_market.update_layout(
    template="plotly_white",
    font=dict(family="Inter, sans-serif", size=13),
    title_font=dict(family="Lilita One", size=18, color="#333"),
    margin=dict(l=40, r=20, t=60, b=40),
    legend_title_text=""
)


# ================ SECTION : VUE CIBLÉE ==================
# Dropdown thème + set
selectors = html.Div([
    dbc.Container([
        html.H4("Analyse d’un set spécifique", className="text-center mb-4 fw-bold", style={"color": "#333"}),

        dbc.Row([
            dbc.Col([
                html.Label("Choisis un groupe de thème :", className="fw-bold"),
                dcc.Dropdown(
                    id="theme-dropdown",
                    options=[{"label": t, "value": t} for t in sorted(df_market["theme_group"].unique())],
                    placeholder="Sélectionne un groupe de thème...",
                    style={"width": "100%"},
                    value="Licensed"
                ),
            ], md=6),

            dbc.Col([
                html.Label("Choisis un set :", className="fw-bold"),
                dcc.Dropdown(
                    id="set-dropdown",
                    options=[],
                    placeholder="Sélectionne un set...",
                    style={"width": "100%"},
                    value=sorted(df_market["theme_group"].unique())[0],
                ),
            ], md=6),
        ], className="mb-4"),

        html.Div(id="market-set-detail", className="text-center mb-4"),

        dbc.Row([
            dbc.Col(dcc.Graph(id="set-price-compare"), md=6),
            dbc.Col(dcc.Graph(id="set-position-scatter"), md=6)
        ]),
    ]),
    
    html.Img(
        src="/assets/family.png",
        style={
            "position": "absolute",   # reste visible au scroll
            "top": "5px",
            "right": "40px",
            "width": "280px",
            "opacity": "0.9",
            "zIndex": "2000",
        }
    )
    
], className="mt-5")




# ================ LAYOUT ==================
layout = dbc.Container([
    html.H2("Marché secondaire LEGO", className="text-center mb-5", style={"color": "#EAB308"}),

    kpis,

    dbc.Row([
        dbc.Col(dcc.Graph(figure=fig_theme_price), md=12)
    ], className="mb-5"),
    
    dbc.Row([
        dbc.Col(dcc.Graph(figure=fig_scatter_market), md=12)
    ], className="mb-5"),

    selectors
], fluid=True, className="p-5", style={"backgroundColor": "#fafafa"})

