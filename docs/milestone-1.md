# Maxpilot -- EzHTML

## Team Overwiew
- Maximilian Kuechen: MAXPIL0T

## Application Idea

- When making my own websites I have often need to insert formated text that has been written in an application such as word or google docs, but it is tedious to convert these into HTML manually. 

    - For example, the following markdown:
        ```md
        # Hello World 

        - This is a bullet point.

        *And this is in italics.*
        ```

        Translates to:

        ```html
        <h1>Hello World</h1>
        <br/>
        <ul>
            <li>This is a bullet point</li>
        </ul>
        <br/>
        <i>And this is in italics.</i>
        ```

    - My single page web app aims to make it easier to convert various types of files into basic html tags.

## Functionality

- A mockup version of the site made with uizard is availiable at https://app.uizard.io/p/493d8b08.

- I'm going to focus on markdown, image and TXT files first and add functionality for other files later.

- My application allows the user to upload a TXT, DOCX, RTF, MD, or a ODT document. The site will then generate the appropriate html based on the uploaded file which the user can view or download. The user can also opt to create an account and sign in. This will allow them to save previously converted files.

- For the users convienience they will have the option to enter the markdown directly into a textbox instead of uploading a file. The converted html will be shown on the right when the user clicks the convert button. They can then choose to preview or download the generated html file.

- Users will have to create an accound and log in before they can use the application. 

- The four pieces of user data are:
    - markdown files
    - image files
    - txt files
    - the generated html files
    - other files that may get support if I have time