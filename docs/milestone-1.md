# Maxpilot -- TODO ADD TITLE

## Team Overwiew
- Maximilian Kuechen: MAXPIL0T

## Application Idea

- When making my own websites I have often need to insert formated text that has been written in an application such as word or google docs, but it is tedious to convert these into HTML manually. My application allows the user to upload a TXT, DOCX, RTF, MD, or a ODT document. The site will then generate the appropriate html based on the uploaded file which the user can view or download.

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