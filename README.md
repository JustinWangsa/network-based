

# to start the server:
- clone the branch
    ```bash
    git clone https://github.com/JustinWangsa/network-based.git -b Server server
    ```
- go to the server directory and install dependency 
    ```bash
    cd server;
    npm install
    ```
- run server
    ```bash
    npm run start
    ```
- server will be listening to http://localhost:3000
- (for page serving capability) in the [index.js](server/routes/index.js), the varaible [client_browserFolder] need to be assign the folder location of the front end resources, relative to the [server](server) folder( ./ refer to file inside the server folder).
    ```js
    const client_browserFolder = 'path/to/client_browser';
    ```
- (for database api capability) set up a mariadb/mysql database 
    - listening to the default port (3306)
    - has an account with:{username:root, password:root}
    - has a database name test_db
    - run the sql code in (server/Ztesting/createTable.sql) in mariadb/mysql
    - (optionally) populate the database with data by running the sql code in (server/Ztesting/populate.sql) in mariabd/mysql



# Database API guide
> DB managing API preface:
- API behaviour (if documentation omit a behaviour, that api will follow the default behaviour defined below):
    - return "err from sql" or "success"
    - input 
        - to send data, use multipart/formdata as content type (the default type for FormData in js and default for fetch)
        - default value will be interpreted as '' or 0 depending on the type

> table design notes (not required to know to use the api):
- item_t and stock_t works together to represent an item. item_t hold data which it's evolution/history doesnt need to be kept, while stock_t are the otherway around.




<br>

### admin API (this is for testing, not used in the final product):
> get /db/admin/dropTable. 
- drops the table
- this is used in combination with create table to reset table data
> get /db/admin/createTable.
- create the table, will fail if the table already exists
> get /db/admin/WhoAmI.
- return the company name if successful

<br>

### non-logid API (do not require login):
> post /db/login_page/sign_up
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


> post /db/login_page/log_in.
- input
    - password
    - name
- return 
    - isManager(0|1)
- it will be successful if that name and password combination exist
- this will add the isManager and companyName to the server's session 

> get /db/login_page/log_out
- wipe the server's session 
    
<br>

### login-required API:
> post /db/stock_page/new_item
- input: 
    - name. 
    - stock. this is the current stock 
    - price
    - icon. 
- return:
    - item_id
- receive only one item at a time
- add this new item into item_t and stock_t


> post /db/stock_page/update_item
- input
    - item_id. 
    - name. if null/'', it will not update that column in the table.
    - icon. if null/'', it will not update that column in the table.
    - stock. 
    - price. (make sure stock and price are either both empty or both filled)
- return 
    item_id
- update item_t for that specific item, while it adds a new record in stock_t.
- this will override the currentStock in item_t

> get /db/stock_page/fetch_item_list
- return: 
    {id,name,image,currentStock,price}[]
- it will return all item and their data for company that is loged in. the price will always be from the newest record

> post /db/transaction_page/new_transaction
- input :
    - data:{item_id:count,...} 
        - the data object is suppose to be an object where it's property are all item's id that are involved in a transactoin, while the property value is how much of that item is flowing. for example: {1:2,2:4} meant that there's 2 item with id 1 and 4 item with id 4.
- return:
    {id,currentstock}[] 
- it will send both insert new entries into transaction_t, but also update the currentStock in item_t


> post /db/transaction_page/update_transaction
- input :
    - data:{time,item_id:count,...} 
        - only need to include item whose quantity changes
        - like /transaction_page/new_transaction input, but one of the property of data must be time:(the transaction time of a transaction)
- return:
    {id,currentstock}[] 
- it will update new entries in transaction_t, and also update the currentStock in item_t


> get /db/transaction_page/fetch_transaction_history
- return:
    {"time","item_id","count","rank"}[]
- this will return the 5 most recent transaction
- rank is a debugging tools, can be ignored
- do note that this doesnt mean there is 5 array entries, since one transaction might be more than just an entries (a transaction involving 3 item, will take 3 array entry space)

> get /db/summary_page/high_level
- return:
    {time, item_id, count, price}[]
- unlike /transaction_page/fetch_transaction_history, this return all transaction history, as well as the price at that time

> get /navigation/export/transaction 
- return: 
    - a plain text that is in the csv format. 
    - the column are: time and each item in the item list
> get /navigation/export/price
- return: 
    - a plain text that is in the csv format. 
    - the column are: time and each item in the item list. this describe the price of each item at each transaction
    - items that are added later on will have the price set to 0 for transaction record before that addition
> get /navigation/export/stock
- return: 
    - a plain text that is in the csv format. 
    - the column are: time and each item in the item list. this shows every time the stock is manually set, since 
    - items that are added later on will have the price set to 0 for transaction record before that addition
> get /navigation/export/stockDynamic
- return: 
    - a plain text that is in the csv format. 
    - the column are: time and each item in the item list. 
    - each row corresponds to each transaction. It shows the calculated current stock after transaction. when a stock is manually set, from that time onward, that number will be treated as the current stock 

