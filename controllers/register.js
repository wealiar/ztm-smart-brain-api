const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;

    // bcrypt.hash(password, saltRounds, function (err, hash) {
    //     // Store hash in your password DB.
    //     console.log('hash', hash);
    //     hashedPass = hash;
    // });

    // synchronous hashing for example
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // creating transaction
    db.transaction(trx => {
        trx
            .insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'));
};


module.exports = {
    handleRegister: this.handleRegister
}