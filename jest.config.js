// eslint-disable-next-line @typescript-eslint/no-var-requires
const { findLemmaById, toMarkdown } = require('./dist/__utils__');

/** @type {import('jest-allure2-reporter').ReporterConfig} */
const allureConfig = {
  testCase: {
    hidden: (context) =>
      context.testCase.status === 'passed' ||
      context.testCase.status === 'skipped' ||
      context.testCase.status === 'pending',
    name: ({ testCase, value }) => {
      const maybeId = parseInt(testCase.title, 10);
      return Number.isFinite(maybeId) ? findLemmaById(String(maybeId)) : value;
    },
    parameters: ({ testCase, value = [] }) => {
      const maybeId = parseInt(testCase.title, 10);
      return Number.isFinite(maybeId)
        ? [
            ...value,
            {
              name: 'ID',
              value: String(maybeId),
            },
          ]
        : value;
    },
    statusDetails: ({ value }) => {
      if (value?.message?.includes(').toMatchSnapshot(')) {
        return {
          message: 'Snapshot mismatch. Click to see the detailed comparison.',
          trace: value?.message,
        };
      }

      return value;
    },
    description: ({ testCase, value = '' }) => {
      return testCase.status === 'failed'
        ? toMarkdown(testCase) + value
        : value;
    },
    descriptionHtml: ({ value = '' }) => `\
      <style>
        h3 ~ table { margin-bottom: 1.25em }
        h3 ~ table > thead { background-color: #e4edfe }
        h3 ~ table th,
        h3 ~ table td {
          border: 1px solid #777;
          padding: 0.5ch;
        }
        h3 ~ table del {
          background-color: #ffe7e6;
          color: #9e0500;
          display: block;
        }
        h3 ~ table del + em {
          font-style: normal;
          background-color: #eef9eb;
          color: #125400;
          display: block;
        }
      </style>
      ${value}`,
  },
  testFile: {
    hidden: () => false,
    name: ({ filePath }) => {
      return filePath.slice(1).join('/');
    },
    parameters: ({ testFile, value = [] }) => [
      ...value,
      {
        name: 'Total tests',
        value:
          testFile.numPassingTests +
          testFile.numFailingTests +
          testFile.numPendingTests,
      },
    ],
    description: ({ testFile, value = '' }) => {
      const {
        numPassingTests: passed,
        numFailingTests: failed,
        numPendingTests: pending,
      } = testFile;

      const summary = `**${passed}** passed, **${failed}** failed, **${pending}** pending`;
      return summary + '\n\n' + value;
    },
  },
  executor: ({ value }) => ({
    ...value,
    reportName: '@interslavic/utils',
  }),
};

/** @type {import('jest').Config} */
module.exports = {
  reporters: ['default', ['jest-allure2-reporter', allureConfig]],
  testEnvironment: 'jest-allure2-reporter/environment-node',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
