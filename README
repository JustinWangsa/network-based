documentation

>request:
minta foto default buat item yang belum punya foto

>general:
- host:localhost, user:root, password:root, dbname:test_db
(semua temporary)
- API by default (only going to write except):
    - return "success" or "fail"

- to send data, use multipart/formdata as content type (the default type for FormData in js and default for fetch)
- data is returned with application/json content type

API:
> get /admin/dropTable. 
- drops the table
- this is used in combination with create table to reset table data
> get /admin/createTable.
- create the table, will fail if the table already exists
> get /admin/WhoAmI.
- return the company name if successful

> post /login_page/sign_up
- input
    - companyName
    - managerName
    - managerPassword
    - cashierName
    - cashierPassword
- this create 
    - a company entry
    - a manager account
    - a cashier account 
- after signup, you still need to login
> post /login_page/log_in.
- input
    - password
    - name
- return isManager
- this will add the isManager and companyName to the server's session 
> get /login_page/log_out
- wipe the server's session 
    
> post /stock_page/update_stock
- input
    - item_id. null means its a new item
    - name. -can be null if item_id is not null. Needs to be unique
    - image. -can be null
    - stock. 
    - price. (make sure stock and price are either both empty or both filled)
- insert or update database
