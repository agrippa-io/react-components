# @agrippa-io/react-components

This project is a React Component library that extends React Material UI.

### Technologies
#### React
 - [React](https://react.dev/)
 - [Material UI](https://mui.com/)
 - [React Hook Form](https://react-hook-form.com/)
#### State Management
 - [Redux](https://redux.js.org/)
 - [Redux Toolkit](https://redux-toolkit.js.org/)
#### Testing
 - [Jest](https://jestjs.io/)
 - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Project Architecture
All implementation files should be stored in the `src` directory, which is 
used as the source directory for the build commands.

The `src` directory is organized as follows:
 - `index.ts` - The `main` export file for the project
 - `assets` - Directory for storing assets importable by JavaScript (`.svg`, `.json`)
 - `components` - Directory for React Component implementations following 
   Atomic Design Principles
 - `features` -   
 
### Design System
#### Atomic Design Principle
We organize components following the [Atomic Design](https://atomicdesign.
bradfrost.com/chapter-2/) Pattern outlined by Brad Frost, which breaks UI 
elements up into the following levels of organization:
 - `atoms` - the lowest level UI elements (i.e. `Link`, `Button`, `Typography`)
 - `molecules` - UI elements composed of 2 or more `atoms`
 - `organisms` - UI elements composed of many `atoms` and/or `molecules` (i.
   e. `UserProfilePanel`, `PaymentCreditCardForm`, `NavigationSidebar`)
 - `templates` - UI elements that compose an entire Application Page, Primary 
   Content or Email templates (i.e. `UserProfilePage`, `CheckoutPaymentPage`,
   `WelcomeEmail`)

#### Material UI
The project extends [Material UI](https://mui.com/), which in it's own 
right operates as a Design System.

Below are useful links for getting started:
 - [Components](https://mui.com/material-ui/all-components/)
 - [Theming](https://mui.com/material-ui/customization/theming/)

Since the project wraps the `Material UI` library, this project acts 
primarily as a place to add Application/Organization specific 
implementations while also providing a live demo of visual changes by 
modifying/providing additional themes using `StorybookJS`.

## Getting Started
```
# Navigate to the directory you want to clone the repository
cd <path>

# Clone @agrippa-io
git clone git@github.com:agrippa-io/react-components.git

# Navigate to the project directory
cd react-components

# Install the project dependencies
yarn

# Start the Storybook project
yarn start
```

### Default Configuration
#### `husky` & `lintstaged`
This project has been setup with `husky` and `lintstaged` to execute scripts on 
the `git` `pre-commit`.

The default configuration of `.lintstagedrc` is as follows:
```
{
    "*.{ts,tsx}": [
        "yarn format",  // Format files using Prettier
        "yarn lint",    // Run ESLint checks
        "yarn test"     // Execute tests
    ]
}
```

This means that before a `git commit` is applied, `yarn format`, `yarn lint` 
and `yarn test` are executed.

If any of these commands fail, the commit is aborted. You can bypass this 
process by adding the `--no-verify` flag to the `git commit` command.

> WARNING: The `--no-verify` flag should never be used with your `main` 
> branch otherwise you are likely to introduce mal-formatted code OR code 
> failing tests.
> 
> USE CASE: The `git commit` is failing lintstaged, but you want to push your
> changes to a remote branch other than `main`.

## Available Scripts

In the project directory, you can run:

### Primary
#### `yarn start`

Since the project is primarily setup to be a Storybook project independent of a
specific React Application, the `yarn start` command is a wrapper for `yarn 
start:storybook`.

If you choose to clone this project and implement a React Application inside 
the project, then you can replace the `yarn start` implementation in 
`package.json` with `yarn start:app` to execute the `create-react-app` 
`react-scripts start` command.

#### `yarn test`

Execute the project test files.

By default, the project is configured with `vitest`, `jest`, and
`react-testing-library`.

#### `yarn build`

The project is configured to create a `/dist` folder that can be configured 
to be imported as a dependency to any JavaScript/Typescript project.

This is implemented using the `vite` package, which creates both `CommonJs` 
and `Module` type dependency files.

##### Forked Repositories
###### Before running `yarn build`
Make sure that you have updated the `name`field in the `package.json` file to your 
new project name. Also update the `version` field to the appropriate version 
number that you would like to use.

Re-run `yarn` to update the `yarn.lock` file with the appropriate project 
and version name.

```
{
  // Replace <organization> with your npm organization
  // Replace <forked-project-name> with your desired name
  "name": "@<organization>/<forked-project-name>",
  // Most likely, the first time you do this you will publish at version 0.0.
  0 or 1.0.0 if you are ready for a production release
  // All subsequent values would be updated by adding 1 to either the 
  <MAJOR>, <MINOR> or <PATCH> values following symantic versioning best 
  practices
  "version": "<MAJOR>.<MINOR>.<PATCH>",
  // ...
}
```

###### After running `yarn build`
Makes sure to create a new commit to save the updated build to your repository.
```
# Stage the `./dist` folder
yarn add ./dist

# Commit the changes
git commit -m "Built vX.X.X for distribution"

# Make sure your remote repository is up-to-date with the build
git push origin <branch>
```

###### Ready to publish to npm?
Assuming you don't have any automated CI/CD process configured in remote 
Version Control System AND you have made sure that version was updated and 
built, you can now manually publish the current build version to `npm` by 
running `npm publish`.

> If you have scoped the project to an `npm organization` or if you are 
> publishing to a `private` package, make sure that you have configured your 
> `$HOME/.npmrc` file to properly handle authentication to `npm`.


### utilities
#### `yarn format`
Runs `prettier --write --parse typescript '**/*.{ts,tsx}'` to reformat 
project files based on the `.prettierrc`.

#### `yarn lint`
Runs `eslint . --ext .ts,.tsx --ignore-path .gitignore --fix` to lint-check 
the project against the linter rules defined in `.eslintrc`.

### storybook
#### `yarn start:storybook`

Runs the Storybook in the development mode.\
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn build:storybook`

Builds the storybook for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### react-scripts
#### `yarn start:app`

Runs the App in the development mode.\
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test:app`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build:app`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject:app`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
