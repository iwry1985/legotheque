from dash import Input, Output, html
import plotly.express as px
from data import df
import pandas as pd

df_market = df.copy()
df_market["condition"] = (
    df_market["condition"]
    .astype(str)
    .str.lower()
    .str.strip()
)

def register_callbacks(app):
    @app.callback(
    Output("set-dropdown", "options"),
    Output("set-dropdown", "value"),
    Input("theme-dropdown", "value"),
    prevent_initial_call=False
    )
    def update_set_dropdown(selected_theme):
        if not selected_theme:
            return [], None

        # filtre sur le thème choisi
        filtered = df_market[df_market["theme_group"] == selected_theme].copy()

        # garde les 5 sets les plus chers (et trie ensuite par prix puis pièces)
        filtered = (
            filtered.sort_values(["current_avg_price", "pieces"], ascending=[False, False])
                    .head(5)
        )

        # construit les options du dropdown
        options = [{"label": n, "value": n} for n in filtered["name"].unique()]

        # premier set du top sélectionné par défaut
        default_value = options[0]["value"] if options else None


        return options, default_value

    @app.callback(
        Output("set-price-compare", "figure"),
        Output("set-position-scatter", "figure"),
        Output("market-set-detail", "children"),
        Input("set-dropdown", "value"),
        prevent_initial_call=False
    )
    def update_selected_set(selected_name):
        if not selected_name:
            return px.bar(), px.scatter(), ""
        df_selected = df_market[df_market["name"] == selected_name]

        fig_compare = px.bar(
            df_selected,
            x="condition",
            y=["current_avg_price", "last_6_month_avg_price"],
            barmode="group",
            title=f"Évolution du prix du set : {selected_name}",
            labels={"value": "Prix (€)", "variable": "Période", "condition": "Condition"},
            color_discrete_sequence=["#EAB308", "#575757"]
        )

        fig_scatter = px.scatter(
            df_market,
            x="pieces",
            y="current_avg_price",
            color="condition",
            opacity=0.25,
            title="Position du set sur le marché",
            color_discrete_map={"new": "#EAB308", "used": "#575757"},
            hover_data=["name", "theme_group"]
        )

        highlight = df_selected.copy()
        fig_scatter.add_scatter(
            x=highlight["pieces"], y=highlight["current_avg_price"],
            mode="markers+text",
            marker=dict(size=15, color="#DB1A21", line=dict(width=2, color="black")),
            text=highlight["name"], textposition="top center",
            showlegend=False
        )
    
    
        new_price = (
            df_selected.loc[df_selected["condition"] == "new", "current_avg_price"].max()
        )
        used_price = (
            df_selected.loc[df_selected["condition"] == "used", "current_avg_price"].max()
        )

        # formate seulement si la valeur existe
        new_price_str = f"{new_price:.2f} €" if pd.notna(new_price) else "—"
        used_price_str = f"{used_price:.2f} €" if pd.notna(used_price) else "—"

        info = html.Div([
            html.H5(selected_name, className="fw-bold"),
            html.P(
                f"Pièces : {int(df_selected.iloc[0]['pieces'])} "
                f"| Thème : {df_selected.iloc[0]['theme_group']}"
            ),
            html.P(f"Prix actuel NEUF : {new_price_str}"),
            html.P(f"Prix actuel OCCASION : {used_price_str}"),
        ])

        return fig_compare, fig_scatter, info
