use test_db;
select "result"\G;
show tables;

desc company_t;
desc item_t;
desc stock_t;
desc transaction_t;
desc user_t;

select "---------------data Dump-------------" \G;
select * from company_t;
select * from user_t;
select * from item_t;
select * from transaction_t;
select * from stock_t;

    


--------- /stock_page/update_limitation


--------- /transaction_page/cart_page


--------- /transaction_page/post_transaction
--------- /transaction_page/fetch_transaction_history
--------- /navigation/export
--------- /summary_page/high_level
--------- /summary_page/log

-- insert into company_t (name) values ("the Company");
-- insert into user_t values (1,false,"theCompany_cashier","mypassword");




