# Bluejay - TP Tester
This project is an extension of Bluejay. The official documentation for Bluejay can be found at: [docs.bluejay.governify.io](https://docs.bluejay.governify.io/). Being an extension of Bluejay, it is essential for the full operation of Bluejay-Tester.# Index
- [Bluejay - TP Tester](#bluejay---tp-tester)
  - [Introduction](#introduction)
    - [What is Bluejay?](#what-is-bluejay)
    - [What is the purpose of Bluejay-TP Tester?](#what-is-the-purpose-of-bluejay-tp-tester)
  - [Getting started](#getting-started)
    - [Development mode](#development-mode)
    - [With docker](#with-docker)
- [Testing TPAs](#testing-tpas)
- [Testing metrics](#testing-metrics)
  - [Editing metrics](#editing-metrics)
- [Testing repositories](#testing-repositories)
- [Interaction with the GitHub API](#interaction-with-the-github-api)
  - [Creating a personal access token](#creating-a-personal-access-token)
- [Interaction with the Bluejay API](#interaction-with-the-bluejay-api)
- [GlassMatrix API](#glassmatrix-api)
  - [API functionalities](#api-functionalities)
  - [API documentation with Swagger](#api-documentation-with-swagger)
  - [Usage examples](#usage-examples)
- [Translations](#translations)

## Introduction
### What is Bluejay?
Bluejay Infrastructure is a Governify-based infrastructure that allows for easy auditing of agile teams. It is composed of a subset of Governify microservices that can be deployed either on a single machine or on a cluster. Bluejay accesses multiple sources to gather information about development teams, such as GitLab, Jira, Slack, etc., and uses this information to verify whether these teams comply with a Team Practice Agreement (TPA) that includes metrics and guarantees related to agile methodology.

### What is the purpose of Bluejay-TP Tester?
The purpose of this TP-Tester is, as its name suggests, to first test the metrics that make up the TPs (Team Practices). Once these metrics have been verified to work correctly, TP-Tester allows you to check that the entire TPA (Team Practice Agreement) works correctly. To do this, you can add, delete, or modify TPAs that are directly in Bluejay from this TP Tester.
## Getting started
### Development mode
To lift Bluejay-TP Tester in development mode, follow these steps:
1. Clone the Bluejay-TP Tester repository.
2. Install the dependencies with `npm install`.
3. Lift the project with `npm start`.

This would be enough since the project uses concurrently and lifts both the express server and angular at the same time. The Express server (GlassMatrix API) is lifted on port 6012 and the Angular application on port 4200.

### With docker
To lift Bluejay-TP Tester with docker, follow these steps:
1. Clone the Bluejay-TP Tester repository.
2. Install the dependencies with `npm install`.
3. Run `npm run docker`.

With this, we would have the project lifted on port 6011 the angular web, and the express server on port 6012.# TPA Management

The TPA Management page is a central hub for managing TPAs (Third Party Applications) in the application. It provides a user-friendly interface for viewing, creating, and managing TPAs.

### Existing TPAs

This section displays a table of all existing TPAs. Each row in the table represents a single TPA, displaying its ID, project, and class.

There are also several action buttons for each TPA:

- The **Copy** button allows you to copy the content of a TPA.
- The **View** button navigates to a detailed view of the TPA.
- The **Edit** button navigates to a page where you can edit the TPA.
- The **Delete** button navigates to a page where you can delete the TPA.

### Create TPA

This section allows you to create a new TPA. It provides a text area where you can input the content of the new TPA.

There are two buttons:

- The **Create TPA** button creates a new TPA with the content you've inputted in the text area.
- The **Copy Default TPA** button fills the text area with the content of a default TPA, which you can then modify and create as a new TPA.

Notifications are displayed in this section to inform you whether the creation of the TPA was successful or not.

The corresponding TypeScript component `TpaManagementComponent` handles the logic for fetching the TPAs, creating a new TPA, and copying the content of a TPA or a default TPA. It interacts with the `BluejayService` and `FilesService` to perform these operations.
## TPA Edit

The TPA Edit page allows you to modify the details of a specific TPA. It displays the current JSON representation of the TPA and provides an interface for editing the metrics and guarantees of the TPA.

### TPA JSON

This section displays the current JSON representation of the TPA. This JSON is read-only and is updated in real-time as you make changes in the other sections.

### Create

This section allows you to add new metrics and guarantees to the TPA. For each metric or guarantee, you can input a name and content. There are also buttons to create the new metric or guarantee and to copy an example metric or guarantee.

The corresponding TypeScript component `SectionsComponent` handles the logic for fetching the TPA, updating the TPA, and adding new metrics and guarantees. It interacts with the `BluejayService`, `FilesService`, and `GlassmatrixService` to perform these operations.

## TPA Delete

The TPA Delete page allows you to delete a specific TPA. It displays the current JSON representation of the TPA and provides a button to confirm the deletion.

The corresponding TypeScript component `TpaDeleteComponent` handles the logic for fetching the TPA and deleting the TPA. It interacts with the `BluejayService` to perform these operations.

## TPA View

The TPA View page allows you to view the details of a specific TPA. It displays the current JSON representation of the TPA and lists out all the metrics and guarantees of the TPA.

The corresponding TypeScript component `TpaViewComponent` handles the logic for fetching the TPA. It interacts with the `BluejayService` to perform this operation.


# Metrics

The Metrics Loader page is designed to manage and test metrics. It provides a user-friendly interface for viewing, creating, and managing metrics.

### Existing metrics

This section displays a table of all existing metrics. Each row in the table represents a single metric, displaying its name and providing action buttons:
- The **View** button navigates to a detailed view of the metric.
- The **Execute/Edit** button navigates to a page where you can execute or edit the metric.
- The **Delete** button deletes the metric.

### Create new metric
This section allows you to create a new metric. It provides a text area where you can input the content of the new metric.

There are two buttons:
- The **Post** button posts the content you've inputted in the text area to the Bluejay API for computation.
- The **Get Computation** button retrieves the computation results from the Bluejay API.

Notifications are displayed in this section to inform you whether the posting of the metric was successful or not.

The corresponding TypeScript component MetricsLoaderComponent handles the logic for fetching the metrics, creating a new metric, and deleting a metric. It interacts with the GlassmatrixService, FilesService, and BluejayService to perform these operations.

## Metrics Viewer
The Metrics Viewer page allows you to view the details of a specific metric. It displays the current JSON representation of the metric.  

The corresponding TypeScript component ViewerComponent handles the logic for fetching the metric. It interacts with the FilesService to perform this operation.

## Metrics Executor
The Metrics Executor page allows you to execute a specific metric. It provides a user-friendly interface for viewing and modifying the metric's details, and for executing the metric.

### Metric Details
This section displays the details of the metric. It provides several input fields where you can modify the metric's details:

- The **Projects** field allows you to specify the project associated with the metric.
- The **Class** field allows you to specify the class associated with the metric.
- The **Period** field allows you to specify the period for the metric.

### Computation Search

This section allows you to specify the parameters for the computation of the metric. It provides several input fields:

- The **Type** field allows you to specify the type of computation.
- The **Period** field allows you to specify the period for the computation.
- The **Initial** field allows you to specify the initial date for the computation.
- The **From** field allows you to specify the starting date for the computation.
- The **End** field allows you to specify the ending date for the computation.
- The **Timezone** field allows you to specify the timezone for the computation.

There are also several buttons:  
- The **Set to Current Hour** button sets the computation parameters to the current hour.
- The **Save as JSON** button saves the metric and its details as a JSON file.
- The **Tutorial** button opens a tutorial dialog.

### Execution Section
This section allows you to execute the metric. It provides a text area where you can view the JSON representation of the metric.  
There are also several buttons:  
- The **Post** button posts the metric to the Bluejay API for computation.
- The **Get Computation** button retrieves the computation results from the Bluejay API.

Notifications are displayed in this section to inform you whether the execution of the metric was successful or not.  

The corresponding TypeScript component ExecutorComponent handles the logic for fetching the metric, updating the metric, executing the metric, and saving the metric as a JSON file. It interacts with the FilesService, BluejayService, and GlassmatrixService to perform these operations.


# Manual Testing Page

The Manual Testing page provides a user-friendly interface for testing the functionality of the application. It provides two main options: creating a new repository or working with a cloned repository.

## New Repository

This section allows you to create a new repository. It provides a brief description of the process and a button to start the creation process.
### Local Page

The Local page displays a list of all cloned repositories. Each row in the table represents a single repository, displaying its name, the number of branches, the last update time, and providing action buttons for viewing, editing, and deleting the repository.

The corresponding TypeScript component `LocalComponent` handles the logic for fetching the list of repositories, deleting a repository, and navigating back to the previous page.

### Clone Page

The Clone page allows you to clone a specific repository. It displays the details of the repository, including its name, description, owner, creation time, update time, language, visibility, and a list of all branches. It also provides a button to clone the repository.

The corresponding TypeScript component `RepositoryComponent` handles the logic for fetching the repository details, fetching the list of branches, and cloning the repository.

## Cloned Repository

This section allows you to work with a cloned repository. It provides a brief description of the process and a button to start working with the cloned repository.

The corresponding TypeScript component `GhSimulatorComponent` handles the logic for navigating to the appropriate pages for creating a new repository or working with a cloned repository.

### Actions Page

The Actions page provides a user-friendly interface for managing a repository. It provides options to view the available branches, change the current branch, create a new file, create a new commit, push changes, view files in the repository, and manage issues.

The corresponding TypeScript component `ActionsComponent` handles the logic for fetching the branches, changing the current branch, creating a new file, creating a new commit, pushing changes, fetching the files in the repository, and managing issues.

### Branches Page

The Branches page provides a user-friendly interface for managing the branches of a repository. It provides options to view the branches, create a new branch, delete a branch, and change the current branch.

The corresponding TypeScript component `BranchesComponent` handles the logic for fetching the branches, creating a new branch, deleting a branch, and changing the current branch.

### Pull Requests Page

The Pull Requests page provides a user-friendly interface for managing the pull requests of a repository. It provides options to create a new pull request, view the open pull requests, and merge a pull request.

The corresponding TypeScript component `PullRequestComponent` handles the logic for creating a new pull request, fetching the open pull requests, and merging a pull request.

# Automated testing
The Automated Testing page provides a user-friendly interface for managing and executing YAML tests. It provides options to view the available YAML files, load the content of a file, view a file, edit a file, delete a file, save a YAML test, set a default format for the YAML test, execute a YAML test, and view the test results.

The corresponding TypeScript component `TestsComponent` handles the logic for loading the YAML files, saving a YAML file, deleting a YAML file, loading the content of a file, executing a YAML test, and managing the test results.

The page is divided into two main sections:

1. The first section displays a table of available YAML files. Each row in the table represents a YAML file and provides options to load the content of the file, view the file, edit the file, and delete the file.

2. The second section provides an interface for executing a YAML test. It includes an input field for the file name, a button to save the YAML test, a button to set a default format for the YAML test, a textarea for the YAML content, a button to execute the YAML test, and a textarea for the test results. It also displays any error messages or save status messages.

The page also includes a loading overlay that is displayed while the YAML test is being executed.


## View saved yaml

The "View Saved Yamels" page provides a user-friendly interface for viewing the content of a saved YAML file. It displays the content of the selected YAML file in a read-only text area.

The corresponding TypeScript component `YamlViewComponent` handles the logic for loading the content of the selected YAML file. It uses the `loadYAMLFile` method of the `GlassmatrixService` to fetch the content of the YAML file. The content is then converted to a string using the `stringify` method of the `yaml` library and displayed in the text area.

## Edit saved yaml
The "Edit Saved Yamels" page provides a user-friendly interface for editing and executing a saved YAML file. It provides options to set a default format for the YAML content, update the YAML content, and execute the YAML content. It also displays any error messages or save status messages.

The corresponding TypeScript component `YamlEditComponent` handles the logic for setting a default format for the YAML content, updating the YAML content, and executing the YAML content. It uses the `setDefaultFormat`, `updateYaml`, and `executeYaml` methods respectively to perform these operations. The component also handles the display of error messages and save status messages.

The page also includes a section for displaying the test results. Each test result is displayed in an alert box. The color of the alert box indicates whether the test was successful (green) or failed (red). The user can remove a test result by clicking the close button in the alert box.


# Configuration page
The Configuration page provides a user-friendly interface for managing the configuration of the application. It provides options to view the active Docker containers, update the application's configuration, view the Swagger documentation, and view the application's documentation.

The corresponding TypeScript component `ConfigComponent` handles the logic for fetching the active Docker containers, fetching the current configuration, updating the configuration, and opening the Github help dialog.

The page is divided into several sections:

1. The Docker Active section displays a table of active Docker containers. Each row in the table represents a Docker container and provides information about the container's ID, name, URL, and port.

2. The Github Token section provides instructions on how to get a Github token. It also includes a button to open a dialog with additional help.

3. The Constants section provides a form for updating the application's configuration. The form includes fields for the base URL, default collector, collector events URL, agreements URL, and scopes URL. There is a button to submit the form and update the configuration.

4. The Swagger section provides a link to the Swagger documentation.

5. The Documentation section provides an embedded PDF viewer for viewing the application's documentation. There is also a button to open the documentation in a new tab.

The component uses the `HttpClient` service to make HTTP requests to the application's API. It uses the `DomSanitizer` service to sanitize the URL for the PDF viewer. It uses the `MatDialog` service to open the Github help dialog. It uses the `ViewportScroller` service to get the current scroll position for positioning the Github help dialog.
## Get github token
This is a step-by-step guide on how to create a personal access token on GitHub:

1. In the upper right corner of any page, click on your profile photo, then click on Settings.
2. In the left sidebar, click on Developer Settings.
3. In the left sidebar, click on Personal Access Tokens.
4. Click on Generate new token.
5. In the "Note" field, give your token a descriptive name.
6. To give your token an expiration, select Expiration, then choose a default option or click on Custom to enter a date.
7. Select the scopes you would like to grant to this token. To use your token to access repositories from the command line, select repo. A token without assigned scopes can only access public information. For more information, see "Scopes for OAuth applications".
8. Click on Generate token.
9. Optionally, to copy the new token to your clipboard, click on the icon of two overlapping squares.

For more information, visit [the official GitHub documentation](https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Swagger API Documentation

This API implements Swagger to always have all the API endpoints in one place along with a small documentation of the operation of each Endpoint. Thanks to Swagger, you can view all the endpoints and test them in its graphical interface that is available at: [http://localhost:6012/api-docs/](http://localhost:6012/api-docs/)

### Usage Examples

Below are some examples of how the API looks through swagger where you can directly execute the calls:

<p align="center">
  <img src="src/assets/images/swagger.png" alt="Swagger" width="400">
</p>

## Translations

Thanks to the ngx-translate library ([github.com/ngx-translate/core](https://github.com/ngx-translate/core)). By default, TP Tester will be in the browser's language. This library also allows adding translations in a simple way as it would be enough to translate the Json from one language to another and there would be no need to modify any other type of file.

This is a snippet of how the language .json works:

```json
"METRICS_LOADER": {
  "TITULO1": "Saved metrics",
  "TITULO2": "Create new metric",
  "MESSAGE_TEXT": "There are no saved metrics",
  "FILE_NAME": "File name",
  "VIEW_FILE": "View file",
  "EXECUTE_EDIT_FILE": "Execute / Edit file",
  "DELETE_FILE": "Delete file",
  "VIEWER": {
    "VIEWING": "fileName."
  }
}
```
