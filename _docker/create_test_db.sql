# Create emenu_test database if it doesn't exist
CREATE DATABASE IF NOT EXISTS emenu_test;

# Grant all privilidges on emenu_test to root
-- GRANT ALL PRIVILEGES ON emenu_test.* TO 'root' identified by 'P@55w0rd';
GRANT ALL PRIVILEGES ON emenu_test.* TO 'root'@'localhost';
