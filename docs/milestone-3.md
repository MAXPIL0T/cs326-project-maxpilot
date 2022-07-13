# Maxpilot -- EzHTML

## Heroku URL:

- https://cs326-project-maxpilot.herokuapp.com/

## Video Link

- https://umass-my.sharepoint.com/:v:/g/personal/mkuechen_umass_edu/EXio2vQM-u5DuXUiXlS7SYABJFeJqT2UPsmWHUmyJq8JWQ?e=2qIcRo

## Important:

- Since heroku doesn't keep persistant state, files are unfortunatly lost after the app goes to sleep. This means that even thoug files may appear visible to the user on the site (Since some information is stored in the postgres database), they are not. If the site is run locally this problem doesn't exist.

- To midigate this I will deploy the site on Azure where this is not an issue, but since Heroku is required for this project, I wanted to note the issue here.

- If ther site is behaving in a unexpected way, namely if the site displayes the wrong html and then signs the user out, create a new account.

## Additional NPM Extension:

- For converting files:
    - https://www.npmjs.com/package/showdown
    - https://www.npmjs.com/package/pammoth
    - https://www.npmjs.com/package/odt2html
    - https://www.npmjs.com/package/image-data-uri

- Additional express server modules
    - express-fileupload
    - fs