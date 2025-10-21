import dash
from dash import html, dcc
import dash_bootstrap_components as dbc
import plotly.express as px
from data import df, df_sales, df_sets
import pandas as pd
from app import lego_colors

dash.register_page(__name__, path="/", name="Vue globale")

# ========== 1. Nombre de sets lancés par année ==========
sets_per_year = (
    df_sets.groupby("launch_year", as_index=False)["set_id"]
    .nunique()
    .sort_values("launch_year")
)
fig_sets = px.bar(
    sets_per_year,
    x="launch_year",
    y="set_id",
    title="Nombre de sets lancés par année",
    labels={"launch_year": "Année", "set_id": "Nombre de sets"},
)

# ========== 2. Prix moyen des sets par année ==========
df_clean = df_sets[df_sets["retail_price"].notna() & (df_sets["retail_price"] > 0)]
avg_price = (
    df_clean.groupby("launch_year", as_index=False)["retail_price"]
    .mean()
    .sort_values("launch_year")
)
fig_avg_price = px.line(
    avg_price,
    x="launch_year",
    y="retail_price",
    title="Évolution du prix moyen des sets LEGO®",
    markers=True,
    labels={"launch_year": "Année", "retail_price": "Prix moyen (€)"},
)

# ========== 3. Nombre moyen de pièces par set ==========
df_clean = df_sets[df_sets["pieces"].notna() & (df_sets["pieces"] > 0)]
avg_pieces = (
    df_clean.groupby("launch_year", as_index=False)["pieces"]
    .mean()
    .sort_values("launch_year")
)
fig_avg_pieces = px.line(
    avg_pieces,
    x="launch_year",
    y="pieces",
    title="Évolution du nombre moyen de pièces par set",
    markers=True,
    labels={"launch_year": "Année", "pieces": "Pièces moyennes"},
)

# ========== 4. Âge minimum moyen par année ==========
df_clean = df_sets[df_sets["min_age"].notna() & (df_sets["min_age"] > 0)]
avg_age = (
    df_clean.groupby("launch_year", as_index=False)["min_age"]
    .mean()
    .sort_values("launch_year")
)
fig_avg_age = px.line(
    avg_age,
    x="launch_year",
    y="min_age",
    title="Évolution de l'âge minimum moyen des sets",
    markers=True,
    labels={"launch_year": "Année", "min_age": "Âge minimum moyen"},
)

# ========== 5. Évolution des sets 18+ ==========
sets_18plus = (
    df_sets[df_sets["min_age"] >= 18]
    .groupby("launch_year", as_index=False)["set_id"]
    .nunique()
    .sort_values("launch_year")
)
fig_18plus = px.bar(
    sets_18plus,
    x="launch_year",
    y="set_id",
    title="Nombre de sets 18+ lancés par année",
    labels={"launch_year": "Année", "set_id": "Nombre de sets 18+"},
)


# ========== 6. Répartition par groupes de thèmes ==========
themes_year = (
    df_sets.groupby(["launch_year", "theme_group"], as_index=False)
    .size()
    .rename(columns={"size": "nb_sets"})
)
max_year = int(df["launch_year"].max())
start_year = 1955
step = 10
themes_year["period"] = pd.cut(
    themes_year["launch_year"],
    bins=range(start_year, max_year + step, step),
    right=False,
    labels=[f"{y}-{y + step - 1}" for y in range(start_year, max_year, step)],
)
fig_theme_grouped = px.bar(
    themes_year,
    x="period",
    y="nb_sets",
    color="theme_group",
    barmode="group",
    title="Répartition des groupes de thèmes par décennie",
    labels={"period": "Décennie", "nb_sets": "Nombre de sets", "theme_group": "Groupe de thème"},
)

# ========== 7. KPI ==========
kpi_theme = df["theme"].value_counts().idxmax()
kpi_theme_count = df["theme"].value_counts().max()
kpi_price = df.loc[df["retail_price"].idxmax(), ["name", "retail_price"]]
kpi_pieces = df.loc[df["pieces"].idxmax(), ["name", "pieces"]]

kpis = dbc.Row([
    dbc.Col(dbc.Card([
        dbc.CardHeader("Thème le plus prolifique", className="fw-bold text-center"),
        dbc.CardBody(html.P(f"{kpi_theme} ({kpi_theme_count} sets)", className="text-center"))
    ], color="warning", inverse=False, outline=True)),

    dbc.Col(dbc.Card([
        dbc.CardHeader("Set le plus cher", className="fw-bold text-center"),
        dbc.CardBody(html.P(f"{kpi_price['name']} ({kpi_price['retail_price']} €)", className="text-center"))
    ], color="warning", inverse=False, outline=True)),

    dbc.Col(dbc.Card([
        dbc.CardHeader("Set avec le plus de pièces", className="fw-bold text-center"),
        dbc.CardBody(html.P(f"{kpi_pieces['name']} ({kpi_pieces['pieces']} pièces)", className="text-center"))
    ], color="warning", inverse=False, outline=True)),
], className="mb-5 justify-content-center")



# ================ LAYOUT ==================
for fig in [fig_sets, fig_avg_price, fig_avg_pieces, fig_avg_age, fig_18plus, fig_theme_grouped]:
    fig.update_layout(
        template="plotly_white",
        colorway=lego_colors,
        font=dict(family="Inter, sans-serif", size=13),
        title_font=dict(family="Lilita One", size=16, color="#333"),
        margin=dict(l=40, r=20, t=60, b=40)
    )
    
    
layout = dbc.Container([
    html.H2("Vue globale LEGO", className="text-center mb-5", style={"color": "#EAB308"}),

    kpis,

    dbc.Row([
        dbc.Col(dcc.Graph(figure=fig_sets), md=6),
        dbc.Col(dcc.Graph(figure=fig_avg_price), md=6)
    ], className="mb-4"),

    dbc.Row([
        dbc.Col(dcc.Graph(figure=fig_avg_pieces), md=6),
        dbc.Col(dcc.Graph(figure=fig_theme_grouped), md=6)
        
    ], className="mb-4"),

    dbc.Row([
        dbc.Col(dcc.Graph(figure=fig_18plus), md=6),
        dbc.Col(dcc.Graph(figure=fig_avg_age), md=6)
    ], className="mb-4"),

], fluid=True, className="p-5", style={"backgroundColor": "#fafafa"})

