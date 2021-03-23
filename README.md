Team Mail It! WIP Code Drop - March 23rd, 2021 

1. The login page will now display an error message when a user provides an incorrect password and when the user exceeds the number of failed login attempts. 
2. The homepage no longer has an issue with the template log grid and the right elements overlapping as the screen shrinks. The user should be able to horizontally scroll 

3. The Template log grid on the homepage has had a few updates:
-The templates are sorted such that the newest template uploaded will appear at the top of the grid 
-The template logs now display the dynamic values that were parsed from the document.
-A loading spinner will appear while the template log is loading 

4. The upload process has had a few updates:
-Templates with malformed dynamic values will not be accepted for uploading and an error message will appear indicating this issue to the user 
-Any templates uploaded after March 23rd will have an “Unsubscribe link” embedded in the footer of the email (this link is not fully operational yet but we’re close to ironing out the last bugs) 
-After the upload process finishes only the grid will refresh instead of the whole page 
Errors that occur in the AWS infrastructure during the upload process should display in an error message in the front end
-A loading spinner should appear during the upload process 
PLEASE NOTE: A template name input field will be added to the upload process in the next deployment. 

Sending a SINGLE email campaign 
-Each dynamic value should appear with its own text field
-Any fields that are empty when the submit button (for the single email campaign set of fields) will have a red-colored border and an error message should appear for the user to fill in all fields. If the email address provided is an invalid format then an error message will appear indicating the issue to the user and the email address field will have a red border.
-When a template has no dynamic values then there should be no text fields that appear and the “Dynamic Values” heading should not be present 
PLEASE NOTE: Email addresses are still sandboxed and therefore require verification by AWS before being used in this application. If you would like your email added to this service please notify Matthew De Rose so that he may add you to SES manually. Please feel free to use the credentials for the test email below to use this application (these credentials work on gmail as well):
The credentials for Gmail and the deployment environment are: 
Email: teamMailItTest@gmail.com
Password: testEmail123

Upcoming Tasks For The Next Code Drop
-Adding a text field for a user to add a template name associated with a file in the upload process
-Integration with the existing AWS infrastructure and the user interface for the pagination of logs in the user interface (will be used for all logs ultimately)
-Final integration with the existing AWS infrastructure and the user interface for the batch email campaign process 
-Linking campaign logs and associated email logs for each template log in the user interface. Each log will have its own grid 
-Ironing out the final bugs of the unsubscribe process
-Finalizing the process of updating the OpenedStatus and Delivery status of an email log 
-Starting off the internationalization stretch goal 

March 16th, 2021 WIP Updates 


Updates Visible In The User Interface 
1. The home page grid (i.e. the template log grid) is now populated with template logs stored in the dynamodb tTemplateLog. The columns that still require implementation are the Team Column (with the team that uploaded the template), No. of Campaigns (number of campaigns created with this tempalte) and the view button in the Campaign Logs column. Also the Status Column has been changed to the "Create Email Campaign" column, the Details column has been changed to the "Campaign Logs" column, the Template Key column has been changed to the File Name column. 
2. The "upload new template" section on the right hand side of the home page has been updated such that there is now a submit button that the user will click on after a docx file has been uploaded. 
3. If the Ready button is clicked on for a template log in the Create Email Campaign column the user will be redirected to a page with a current preview of the image. Email campaigns cannot be created using the UI just yet however a single email can be sent using the API. The AWS infrastructure is being finalized for the batch email service and one of our teammembers has started the process of integrating the user interface with the AWS infrastructure. By the next code drop next sunday we are hoping to be able to send a single email using the user interface. 
4. The user login still has a few bugs with having error messages appear on the page and the "remember me" function is not operational. A teammember is working to resolve these issues by the next code drop next Sunday. 
5. The docx file upload process is now integrated with the template log grid on the home page. Currently after a template is successfully created the page will refresh the whole page and the log will appear on the grid. As of this momment the newest template log does not appear at the top of the grid and can appear at any place on the grid. We are working to order the template logs by upload date and time in addition to making sure that only the grid updates when a new template is successfully uploaded (and the whole page does not have to refresh in order to update the grid). 

Updates Not Currently Visible In The User Interface 
1. When a customer opens an email we are able to update the Opened Status of the email log stored in dynamo db
2. When a template has an ${UNSUBSCRIBE_LINK} dynamic value added to it, it will be populated with a link that will allow any customer to unsubscribe from future emails from the system. For the next code drop we hope that all uploaded templates will have this dynamic value embedded into the footer of the template. 
3. The first implementation of the aws infrastructure for the batch email campaign service has been created and is being tested

Hopeful Updates for the next sprint. 
1. All login bugs will be resolved 
2. The campaign log and email log grids will be created and possibly integrated with the template log grid on the home page. 
3. A single email will be able to be sent from the user interface and hopefully the batch email service will usable with the UI as well 
4. The delivery status of an email will be reflected in the email log 
5. Any errors that occur in the upload process will appear as an error message. Currently if an error occurs the messsage displayed in the front end user interface is a success message which is not desired. 
6. Logs will be paginated such that there is a fixed maximum amount of logs that can appear at once. 
7. 

Design Changes 
1. We have introduced the Campaign Log data type to our data model. Since 1000s of emails can be created in a single campaign we felt the need to create a log for each campaign created to improve accesssibility of the user to email logs that may have occured previously. This log will contain information about when the campaign was created, the number of emails (one or more) included in a campaign, the number of successfully delivered emails, the number of emails that have been opened by users, the number emails that have had at least one link clicked on by a user and a link to all email logs associated with a campaign. Campaign logss will be either accessibile per tempalte from the the tempalte log grid or from the "View All Campaign Logs" button on the right hand side of the home page (which will provide the list of campaign logs created from all templates ordered by date.
