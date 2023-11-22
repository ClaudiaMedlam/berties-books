module.exports = function(app, shopData) {

    // Handle our routes
    // HOMEPAGE
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });

    // ABOUT PAGE
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });

    // SEARCH PAGES
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });

    // Search results return books that contain the keyword entered in /search
    app.get('/search-result', function (req, res) { 
        // Searching the database
        let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
       
        // Execute sql query with wildcards to perform a case-insensitive partial match
        let searchRecord = ['%' + req.query.keyword + '%'];
        db.query(sqlquery, searchRecord, (err, result) => {
        if (err) {
            return console.error(err.message);
        }

        // Create object combining shopData and search result
        let newData = Object.assign({}, shopData, {foundBooks:result});
        res.render('search-result.ejs', newData)
        });

    });
    
    // BOOK LIST PAGE
    app.get('/list', function(req, res) {
        // Query database to get all the books
        let sqlquery = "SELECT * FROM books"; 

        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            
            // Create object combining shopData and search result
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData.name + newData.price);
            res.render('list.ejs', newData);

        });

    });

    // ADDING BOOK PAGES
    app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);                                                                     
    }); 

    app.post('/bookadded', function(req, res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"; 

        // Preparing the data for query
        let newrecord = [req.body.name, req.body.price];
        // Execute sql query
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            
            // Confirmation message
            else {
                res.send("This book has been added to database: name: " + 
                req.body.name + ",   price: " + req.body.price);

            }

        });
    });

    // BARGAIN BOOK LIST
    app.get('/bargainbooks', function(req, res) {
        // Query database to get name and price of all books under £20
        let sqlquery = "SELECT name, price FROM books WHERE price<20";

        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            
            // Create object combining shopData and search result
            let newData = Object.assign({}, shopData, {cheapBooks:result});
            console.log(newData.name + newData.price);
            res.render('bargainbooks.ejs', newData);

        });

    });

    // REGISTRATION PAGES
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });  
    
    app.post('/registered', function (req,res) {

        // Handling form data and responding to user
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 

}
