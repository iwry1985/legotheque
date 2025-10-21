from dash import Dash, html, page_container
import dash_bootstrap_components as dbc
from callbacks import market_callbacks


lego_colors = [
    "#EAB308",  
    "#DB1A21",  
    "#006CB7",  
    "#008F4C",  
    "#FF6F00",  
    "#575757"   
]

# ================ INIT APP ==================
app = Dash(
    __name__, 
    use_pages=True, 
    suppress_callback_exceptions=True, 
    external_stylesheets=[dbc.themes.LUX],
    prevent_initial_callbacks="initial_duplicate"
)

market_callbacks.register_callbacks(app)
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
            dbc.NavItem(dbc.NavLink("Vue globale", href="/", active="exact" )),
            dbc.NavItem(dbc.NavLink("Marché secondaire", href="/market", active="exact")),
        ], className="ms-auto", navbar=True),
    ]),
    color="light",
    dark=False,
    sticky="top",
    style={"borderBottom": "4px solid #EAB308", "zIndex":5}  # ligne jaune LEGO
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



