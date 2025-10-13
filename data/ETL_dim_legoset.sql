INSERT INTO d_legoset (
    set_id, pieces, retail_price, name,
    launch_year, rating, min_age, height, width,
    minifigs, review_count, theme
)
SELECT *
FROM dblink(
    'dbname=legothec user=postgres password=technofutur2025 host=localhost',
    $$
    SELECT
        bricksetid,
        pieces,
        retailprice,
        lego.name,
        year AS launch_year,
        rating,
        minage,
        height,
        width,
        minifigs,
        reviewcount,
        th.name AS theme
    FROM legoset AS lego
    LEFT JOIN theme AS th ON th.themeid = lego.themeid
	WHERE year IS NOT NULL
    $$
) AS src(
    set_id TEXT,
    pieces INT,
    retail_price NUMERIC,
    name TEXT,
    launch_year INT,
    rating NUMERIC,
    min_age INT,
    height NUMERIC,
    width NUMERIC,
    minifigs INT,
    review_count INT,
    theme TEXT
)
WHERE NOT EXISTS (
    SELECT 1 FROM d_legoset d WHERE d.set_id = src.set_id
);

