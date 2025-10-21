from dash import Dash, html, dcc, page_container, page_registry
import dash_bootstrap_components as dbc


lego_colors = [
    "#EAB308",  # jaune LEGO
    "#DB1A21",  # rouge LEGO
    "#006CB7",  # bleu LEGO
    "#008F4C",  # vert LEGO
    "#FF6F00",  # orange accent
    "#575757"   # gris neutre
]

# ================ INIT APP ==================
app = Dash(__name__, use_pages=True, suppress_callback_exceptions=True, external_stylesheets=[dbc.themes.LUX])


# =========================================================
#  Navbar
# =========================================================
navbar = dbc.Navbar(
    dbc.Container([
        # titre
        html.A(
            dbc.Row([
                dbc.Col(html.Img(src="/assets/logo.png", height="40px")),
                dbc.Col(dbc.NavbarBrand("Dashboard", className="ms-2 fw-bold")),
            ], align="center", className="g-0"),
            href="/",
            style={"textDecoration": "none", "color": "#333"}
        ),

        # Liens de navigation
        dbc.Nav([
            dbc.NavItem(dbc.NavLink("Vue globale", href="/", active="exact")),
            dbc.NavItem(dbc.NavLink("Marché secondaire", href="/market", active="exact")),
        ], className="ms-auto", navbar=True),
    ]),
    color="light",
    dark=False,
    sticky="top",
    style={"borderBottom": "4px solid #EAB308"}  # ligne jaune LEGO
)

# =========================================================
#  Layout principal
# =========================================================
app.layout = html.Div([
    navbar,
    html.Div(page_container)  # pour ne pas cacher le contenu
])

# =========================================================
#  Run
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)


