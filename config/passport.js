const localStrategy = require('passport-local').Strategy
const {db,Users} = require('./db')
const bcrypt = require('bcryptjs')

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email'}, async (email,password,done) =>{
            //Match user

            const user = await Users.findByPk(email)

            if(!user){
                return done(null, false, { message: ' email is not registered' })
            }else{
                if (await bcrypt.compare(password, user.password))
                {
                    return done(null,user)
                }else{
                    return done(null,false, {message: 'password incorrect'})
                }
            }

        })
    )

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async(user, done) => {
        const user1 = await Users.findByPk(user.email)
        if(user1){
            done(null,user)
        }
    });

}

