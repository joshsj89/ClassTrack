# ClassTrack

ClassTrack is an extension...

## Prerequisites
- Node.js and npm installed on your machine.
- A modern web browser (Chrome, Firefox, etc.) for testing the extension.

## Running the Extension

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies using `npm install`.
4. Build the project using `npm run build`.
5. Open Chrome and navigate to `chrome://extensions/`.
6. Enable "Developer mode" in the top right corner.
7. Click on "Load unpacked" and select the `build` directory of the cloned repository.
8. The extension should now be loaded and ready to use.
9. Open the extension by clicking on its icon in the Chrome toolbar.
10. Follow the on-screen instructions to set up the extension.
11. Use the extension to track your classes and manage your schedule.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

The build folder is where the production-ready version of the extension will be located. You can load this folder into Chrome as an unpacked extension.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run watch`

Runs the app in watch mode.\
This command is useful for development and testing purposes. It will automatically rebuild the app whenever you make changes to the source code.
This allows you to use the VS Code debugger to debug the extension in Chrome.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
