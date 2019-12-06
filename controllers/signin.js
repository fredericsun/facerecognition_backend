const handleSignIn = (req, res, db, bcrypt) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json('incorret information');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(async data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                try {
                    const user = await db.select('*').from('users')
                        .where('email', '=', req.body.email);
                    res.json(user[0]);
                }
                catch (err) {
                    return res.status(400).json('Unable to get user');
                }
            }
            else
                res.status(400).json('Wrong Credentials')
        })
        .catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
};