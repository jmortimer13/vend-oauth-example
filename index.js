/* Dependencies */
const express = require('express')
const axios = require('axios')

/* ExpressJS */
const app = express()
const port = 3000

/* OAuth Configuration */
const clientId = 'REPLACEME'
const clientSecret = 'REPLACEME'
const clientState = '1337'
const redirectBaseURL = 'REPLACEME'
const redirectPath = '/oauth/callback'
const redirectURI = redirectBaseURL + redirectPath

/* OAuth Request Data */
var code = null
var domain_prefix = null
var user_id = null
var state = null
var signature = null
var error = null
var refreshToken = null
var accessToken = null

/* Dependencies */
app.listen(port, () => {
    console.log(`Vend OAuth Example listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    var homeScreen = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Home</title>
                <style>
                    div.indented {
                        position: relative;
                        left: 30px;
                    }
                    .button {
                        background-color: #4CAF50;
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        width: 300px;
                    }
                </style>
            </head>
            <body>
                <div class="indented">
                    <h1>Status : ${code ? "Logged In" : "Logged Out"}</h1>
                    <pre>         code : ${code}</pre>
                    <pre>domain_prefix : ${domain_prefix}</pre>
                    <pre>      user_id : ${user_id}</pre>
                    <pre>        state : ${state}</pre>
                    <pre>    signature : ${signature}</pre>
                    <pre>        error : ${error}</pre>
                    <pre>refresh_token : ${refreshToken}</pre>
                    <pre>  acess_token : ${accessToken}</pre>
                    <script type="text/javascript">
                        function signIn() {
                            window.location.href = '/oauth/sign_in'
                        }
                        function getRefreshToken() {
                            window.location.href = '/oauth/refresh_token'
                        }
                        function getAccessToken() {
                            window.location.href = '/oauth/access_token'
                        }
                    </script>
                    <div>
                        <br><br>
                        <button class="button" onclick="signIn()">Sign In</button>
                        <br><br>
                        <button class="button" onclick="getRefreshToken()">Get Refresh Token</button>
                        <br><br>
                        <button class="button" onclick="getAccessToken()">Refresh Access Token</button>
                    </div>
                </div>
            </body>
        </html>
    `

    res.send(homeScreen)
})

app.get('/oauth/sign_in', function (req, res) {
    res.redirect(`https://secure.vendhq.com/connect?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${clientState}`)
})

app.get('/oauth/callback', function (req, res) {
    code=req.query.code
    domain_prefix=req.query.domain_prefix
    user_id=req.query.user_id
    state=req.query.state
    signature=req.query.signature
    error=error

    res.redirect('/home')
})

app.get('/oauth/refresh_token', function (req, res) {
    axios
        .post(`https://${domain_prefix}.vendhq.com/api/1.0/token`,
        `code=${encodeURIComponent(code)}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectURI)}`,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Lightspeed Retail 1.0.0'
            }
        })
        .then(axios_res => {
            refreshToken = axios_res.data.refresh_token
            accessToken = axios_res.data.access_token
            res.redirect('/home')
        })
        .catch(error => {
            console.error(error)
            res.redirect('/home')
        })
})

app.get('/oauth/access_token', function (req, res) {
    axios
        .post(`https://${domain_prefix}.vendhq.com/api/1.0/token`,
        `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Lightspeed Retail 1.0.0'
            }
        })
        .then(axios_res => {
            if (axios_res.data.refresh_token != null) {
                refreshToken = axios_res.data.refresh_token
            }
            accessToken = axios_res.data.access_token
            res.redirect('/home')
        })
        .catch(error => {
            console.error(error)
            res.redirect('/home')
        })
})