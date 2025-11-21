login/homepage
- login as a user
    - __::loginPage__ initally show login field (username,password,submit button), but has sign up button to show sign up option (identical)
    - login POST to __/general/login__ body:(username,password), return whether matched or not
    - signUP POST to __/general/signup__ body:(username,password), 
    - then this leads to __::homePage__
<!-- - a user can create a company. think of company as a group chat, the creator become the manager
    - the __::homePage__ has a button to create a company
    - in the __::createCompanyPage__, fill {} -->
<!-- - manager can invite other user as ==employee== or as manager
    - to invite
        - for manager, in the __::companyPage__, there will be a button to create invite
        - in the __::createInvitePage__, fill {user_key, role, msg(optional) } then click submit
        - POST to __/manager/invite__ 
    - to accept or decine invite
        - in the __::homePage__ there will be a 
- user can start participating in the company by
    -  the __::homePage__ will show a list of company the user is in  -->
- (optional) user customization at __::homePage__'s user icon


employee
- input current order content,which is sent to the database
    - mutliple button which represent all available menu,
        - specific action (can be different accros platform) to add,subtract,cancel order
        - each button will store {count, price}, each press updates count (price update each day) 
        - each press also displayed count based on this data, and also start timer for submitting data
        - each order will have an indicator for whether it has been submitted yet, any order changes will revert it into non submitted 
        - button is grouped, there is a button that navigate to that group
    - POST to [/employee/addRecord] 
        - when : 
            - moving to different page/previous order
            - five minute after no changes to order content
            - pressing submit button (explicit submission)
        - body : {company, user, ... transaction_t}
        - the date of the transaction is when the order content is last modified before the first time it is sent to the database
        - wifi down support
            - this data in chasier client is kept until its successfully sent, thus when internet goes down it will still retain that information. 
- show total price
    - in a footer (position:fixed)
    - numbers update each changes to order content, summing all content
- fix previous order / go back to previous order
    - only n number of previous order are visible
    - the previous order is fetch, not stored in client device
        - getPrevious(nth). get nth most recent
    - the current order is drafted
- change the appearence/ order of their interface 


manager
- store transaction history and inventory in SQL
- dump data, in an csv (if possible spreadsheet)
    - seperate sheet for each day 
- change list of menu and their price
- also store ingredients quantity for each menu and the price of each ingredients

- input (add) newly aquired inventory, 
    - while this app will automatically subtract it depending on transaction 
    - manager can correct this data 
    

design
- the biggest dilema is whether each manager has a server or only one public server?
    - one server
        - +
            - manager doesnt have to make their own server
        - -
    - individual server
        - +
        - - 
            - manager need to set up their own server (local network)
- remove the default file,... banner in electron
- disable dev tool when publishing