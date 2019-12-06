const handleSignUp = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorret information');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(async loginEmail => {
                    const user = await trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                            joined: new Date()
                        });
                    res.json(user[0]);
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch(err => res.status(400).json('Unable to Register'))
        });
    });
}

module.exports = {
    handleSignUp: handleSignUp
};