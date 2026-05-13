import sqlalchemy

# Create engine with sync driver
engine = sqlalchemy.create_engine('postgresql://postgres:root@localhost:5432/foodstoreSDD')

# Check if table exists
with engine.connect() as conn:
    result = conn.execute(sqlalchemy.text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    tables = [row[0] for row in result]
    print('Tables:', tables)

    if 'users' in tables:
        result = conn.execute(sqlalchemy.text('SELECT column_name FROM information_schema.columns WHERE table_name = \'users\''))
        cols = [row[0] for row in result]
        print('Users columns:', cols)

        # Add column if missing
        if 'password_changed_at' not in cols:
            print('Adding password_changed_at column...')
            conn.execute(sqlalchemy.text('ALTER TABLE users ADD COLUMN password_changed_at TIMESTAMP WITH TIME ZONE'))
            conn.commit()
            print('Column added!')
        else:
            print('Column already exists')