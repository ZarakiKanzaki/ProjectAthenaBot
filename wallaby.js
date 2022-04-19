module.exports = ({
    smartStart: [
        /* On start, run all tests where the 
           filename contains the string: "basic" */
        { startMode: 'always', pattern: '**/*basic*' },

        /* Change the default start mode from "open" 
           to "edit" for all test files */
        { startMode: 'edit' },

        /* Never run any tests where the filename contains
           the string: "database" */
        { startMode: 'never', pattern: '**/*database*' },
    ],
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'test/*.test.ts'
    ],
    setupFiles: ["dotenv/config"],
}); 