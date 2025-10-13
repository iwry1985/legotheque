DO $$
DECLARE
    start_date DATE := '1955-01-01';
    end_date   DATE := '2025-12-31';
BEGIN
    WHILE start_date <= end_date LOOP
        INSERT INTO d_date (
            "pk_date",
            "year_",
            "month_"
        )
        VALUES (
            EXTRACT(YEAR FROM start_date)::INT * 100 + EXTRACT(MONTH FROM start_date)::INT,
            EXTRACT(YEAR FROM start_date)::INT,
            EXTRACT(MONTH FROM start_date)::INT
        );

        -- Incrément d’un mois
        start_date := start_date + INTERVAL '1 month';
    END LOOP;
END $$;



SELECT * FROM d_date;