# Vend OAuth Example
This is a NodeJS app which uses ExpressJS to perform the OAuth login flow to Vend

# Setup
## Requirements
### vend accounts
You need to create a vend merchant store AND a vend developer account!
https://www.vendhq.com/ (Select Free Trial)
https://developers.vendhq.com/developer/sign-in 

You must also make an app to get a clientId and clientSecret.
You can fill in a fake URL for the redirect URI, but will need to replace it later in the guide.

### node
This app is built with Node 16.x, you can use NVM to install node versions:\
`nvm install 16.4.2`

Once you have Node, do the typical install:\
`npm install`

### ngrok
Ngrok is a tool that allows secure HTTPS tunneling which is important for the OAuth process to work:\
`brew install --cask ngrok`

## Running the app
Step 1: Run ngrok on port 3000\
`ngrok http localhost:3000`

COPY the https ngrok URL into your Vend application "redirect URI" field!\
You will also need to COPY this URL into the index.js file as described in the next step.

Step 2: Update index.js\
Look at the `index.js` file and fill in all the REPLACEME instances with your own data
- clientId (provided by Vend)
- clientSecret (provided by Vend)
- redirectURI (ngrok url)

Step 3: Run the app\
`node index.js`

You will see a message that the app is running on port 3000

Step 4: Perform OAuth sign in\
- Go to `localhost:3000` in your browser
- Click `Sign In` and sign in to your mrechant
- Click `Get Refresh Token` to get a refresh token and your initial access token
- Click `Get Access Token` to refresh your access token

You will need to repeat step 4 every time you open the app.\
You need to replace the redirect URI in Vend AND index.js each time you start ngrok as the URL will change.