const bcrypt = require('bcrypt');

const hashPassword = async(pw) => {
    const hash = await bcrypt.hash(pw, 10);
    console.log(salt);
    console.log(hash);
}

const login = async(pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);

    if(result){
        console.log('Login Succesfully');
    } else {
        console.log('Incorrect Password!');
    }
}

hashPassword('hello'); // $2b$10$Pu6HitfHVR7ChoWyjetkLe8cVeeUCVqvXXkDYFygbi5e8N26cB9IS
login('hello', '$2b$10$Pu6HitfHVR7ChoWyjetkLe8cVeeUCVqvXXkDYFygbi5e8N26cB9IS');