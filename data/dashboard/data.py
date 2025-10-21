import pandas as pd
from sqlalchemy import create_engine

#config db
DB_USER = 'postgres'
DB_PASS = 'technofutur2025'
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'legothec_warehouse'
DB_WAREHOUSE = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

#connexion
engine = create_engine(DB_WAREHOUSE)


#get tables
df_sets = pd.read_sql_table(table_name="d_legoset", con=engine)
df_sales = pd.read_sql_table(table_name="f_sales", con=engine)

#merge tables
df = pd.merge(df_sales, df_sets, left_on="fk_set_id", right_on='set_id', how="inner")

if __name__ == '__main__':
    print(df.head())