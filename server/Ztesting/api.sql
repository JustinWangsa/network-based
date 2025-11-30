use test_db;

---------- /login_page/sign_up
    -- insert into company_t (name) values ("companyName");
    -- insert into user_t set 
    --     company_id = (
    --         select id from company_t where name = "companyName"
    --     ),
    --     isManager = true,
    --     name = "manager",
    --     password = SHA1("mypw1")
    -- ;
    -- insert into user_t set 
    --     company_id = (
    --         select id from company_t where name = "companyName"
    --     ),
    --     isManager = false,
    --     name = "cashier",
    --     password = SHA1("pw3")
    -- ;


        
--------- /login_page/log_in
    -- select * from user_t where name = "manager" and password = SHA1("mypw1");





    -- select * from user_t where name = "manager" and password = SHA1("mypw1");
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

select "---------------data Dump-------------" \G;
select * from company_t;
select * from user_t;
select * from item_t;
select * from transaction_t;
select * from stock_t;


