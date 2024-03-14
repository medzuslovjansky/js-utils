// eslint-disable-next-line @typescript-eslint/no-var-requires
const { findLemmaById, toHTML } = require('./dist/__utils__');

const isId = (value) => Number.isFinite(parseInt(value, 10));

/** @type {import('jest-allure2-reporter').ReporterConfig} */
const allureConfig = {
  testCase: {
    hidden: (context) =>
      context.testCase.status === 'passed' ||
      context.testCase.status === 'skipped' ||
      context.testCase.status === 'pending',
    name: ({ testCase, value }) => {
      const maybeId = testCase.title;
      return isId(maybeId) ? findLemmaById(String(maybeId)) : value;
    },
    parameters: ({ testCase, value = [] }) => {
      const maybeId = testCase.title;
      return isId(maybeId)
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
    description: () => void 0,
    descriptionHtml: ({ testCase, value = '' }) => {
      const content =
        testCase.status === 'failed' ? toHTML(testCase) + value : value;

      return `\
        <style>
          figcaption { margin: 1em 0; font-style: italic; }
          figure caption { font-style: italic; margin-bottom: 0.5em; text-align: left }
          figure > table { margin-bottom: 0.75em }
          figure th { background-color: #e4edfe }
          figure th, figure td {
            border: 1px solid #777;
            padding: 0.5ch;
          }
          figure td > del {
            background-color: #ffe7e6;
            color: #9e0500;
            display: block;
          }
          figure td > ins {
            font-style: normal;
            background-color: #eef9eb;
            color: #125400;
            display: block;
          }
        </style>
        ${content}
        <div id="disqus_thread"></div>
        <script>
            var disqus_config = function () {
              const testID = ${JSON.stringify(testCase.fullName)};
              this.language = navigator.language;
              this.page.url = window.location.href;
              this.page.title = window.location.hostname + '(' + testID + ')';
              this.page.identifier = window.location.hostname + '/allure/' + encodeURIComponent(testID);
            };
            (function() {
            var d = document, s = d.createElement('script');
            s.src = 'https://interslavic-allure.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
            })();
        </script>`;
    },
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
    status: ({ testFile, value }) => {
      return testFile.numFailingTests > 0 ? 'failed' : value;
    },
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
  collectCoverage: !!process.env.CI,
  reporters: ['default', ['jest-allure2-reporter', allureConfig]],
  testEnvironment: 'jest-allure2-reporter/environment-node',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
