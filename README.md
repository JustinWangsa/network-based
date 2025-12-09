documentation

>request:
minta foto default buat item yang belum punya foto

>general:
- host:localhost, user:root, password:root, dbname:test_db
(semua temporary)
- API default behaviour (if documentation omit a behaviour, that api behaviour is the default defined here):
    - return "err from sql" or "fail"
    - input 
        - send data (including file) normally using multipart/form-data
        - default value will be '' or 0 depending on the type
    - the method that will be used 

- to send data, use multipart/formdata as content type (the default type for FormData in js and default for fetch)
- data is returned with application/json content type

<br>

### admin API (this is for testing, not used in the final product):
> get /admin/dropTable. 
- drops the table
- this is used in combination with create table to reset table data
> get /admin/createTable.
- create the table, will fail if the table already exists
> get /admin/WhoAmI.
- return the company name if successful

<br>

### non-logid API (do not require login):
> post /login_page/sign_up
- input
    - companyName
    - managerName
    - managerPassword
    - cashierName
    - cashierPassword
- create new company in company_t
- create new manager account in user_t
- create new cashier account in user_t
- note 
    - after signup, you still need to login
> post /login_page/log_in.
- input
    - password
    - name
- return 
    - isManager
- it will be successful if that name and password combination exist
- this will add the isManager and companyName to the server's session 

> get /login_page/log_out
- wipe the server's session 
    
<br>

### login-required API:
> post /stock_page/new_item
- input: 
    - name. default(as per other field) will be '' or 0
    - stock. this is the current stock 
    - price
    - image. send file normally 
-mechanism:
    -new entry to item_t 
        -id = auto
        -{company_id} = session
-        name 
        -currentStock = stock
-        image
    -new entry to stock_t
        - {company_id} = session
        - time = now()
        - item_id = from previous query
        - stock 
        - price
    -also set currentStock into the new stock
-return: item_id
> post /stock_page/update_stock
- input
    - item_id. null means its a new item
    - name. -can be null if item_id is not null. Needs to be unique
    - image. -can be null
    - stock. 
    - price. (make sure stock and price are either both empty or both filled)
- insert or update database


/stock_page
    
    /stock_page/update_item
        input: 
            item_id
            name
            stock //stock and price, either both filled or both empty
            price
            image
        mechanism:
            if both stock and price are provided
            insert to stock_t
                {company_id} = session
                time = now()
                item_id = from previous query
                _stock 
                _price

            if necessary
            update to item_t 
                _name 
                _currentStock = stock
                _image
            where 
                id = item_id
                
            
        return: item_id
    /stock_page/fetch_item_list
        input: -
        mechanism:
            join item_t and stock_t (I.id, I.name, I.image, I.currentStock, S.price) 
            on (item_id)  
            where company_id, newest date,
        return: [{id:...,name:...},...]
/transaction_page
    /transaction_page/cart_page (client side)
    /transaction_page/new_transaction
        input :
            data:{item_id:count,...} 
        mechanism:
            for all item, add this to transaction_t
                {company_id}=session
                time = now()
                _item_id 
                _count
            subtract from current 
        return:[{id,currentstock},...] for each item SENT
    /transaction_page/fetch_transaction_history
        input : -
        mechanism:
            select top 5 newest transaction
        return:{time1:{item...}, time2:{...}}
    /transaction_page/update_transaction
        input :
            - {time:000,item_id:count,...} // should only post item whose count change
        mechanism:
            select from transaction_t
                item_id
                count
            where
                {company_id} = session
                _time 
            
            then find difference

            update transation_t for each item sent
                _item_id
                _count
            where
                {company_id} = session
                _time
            update currentStock in item_t

            update item_t for each item sent
                currentStock = currenstock + difference
                where _item_id 
        return:current stock for each item
