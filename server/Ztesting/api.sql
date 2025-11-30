use test_db;

---------- /login_page/sign_up
    -- insert into company_t (name) values ("companyName");
    -- insert into user_t values (1,true,"manager",SHA1("pw1"));
    -- insert into user_t values (1,false,"cashier",SHA1("pw3"));


--------- /login_page/log_in
    select * from user_t where name = "cashier" and password = SHA1("pw3");

    


    -- select BIT_LENGTH(SHA1("pw3"));
    -- select BIT_LENGTH(password) from user_t where name = "cashier";
    -- select SHA1('hello');
-- /transaction_page/cart_page
-- /transaction_page/post_transaction
-- /transaction_page/fetch_transaction_history
-- /navigation/export
-- /stock_page/update_stock
-- /stock_page/update_limitation
-- /summary_page/high_level
-- /summary_page/log

-- insert into company_t (name) values ("the Company");
-- insert into user_t values (1,false,"theCompany_cashier","mypassword");

select * from company_t;
select * from user_t;
select * from item_t;
select * from transaction_t;
select * from stock_t;


