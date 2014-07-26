#!/usr/bin/env node

'use strict';
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
var semver = require('semver');
var archy = require('archy');
var Liftoff = require('liftoff');
var tildify = require('tildify');
var interpret = require('interpret');
var completion = require('../lib/completion');
var argv = require('minimist')(process.argv.slice(2));
var taskTree = require('../lib/taskTree');

// set env var for ORIGINAL cwd
// before anything touches it
process.env.INIT_CWD = process.cwd();

var cli = new Liftoff({
  name: 'assemble',
  completions: completion,
  extensions: interpret.jsVariants
});

// exit with 0 or 1
var failed = false;
process.once('exit', function(code) {
  if (code === 0 && failed) {
    process.exit(1);
  }
});

// parse those args m8
var cliPackage = require('../package');
var versionFlag = argv.v || argv.version;
var tasksFlag = argv.T || argv.tasks;
var tasks = argv._;
var toRun = tasks.length ? tasks : ['default'];

// this is a hold-over until we have a better logging system
// with log levels
var simpleTasksFlag = argv['tasks-simple'];
var shouldLog = !argv.silent && !simpleTasksFlag;

if (!shouldLog) {
  gutil.log = function(){};
}

// wire up a few err listeners to liftoff
cli.on('require', function (name) {
  gutil.log('Requiring external module', chalk.magenta(name));
});

cli.on('requireFail', function (name) {
  gutil.log(chalk.red('Failed to load external module'), chalk.magenta(name));
});

cli.launch({
  cwd: argv.cwd,
  configPath: argv.assemblefile,
  require: argv.require,
  completion: argv.completion
}, handleArguments);

// the actual logic
function handleArguments(env) {
  if (versionFlag) {
    gutil.log('CLI version', cliPackage.version);
    if (env.modulePackage) {
      gutil.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }

  if (!env.modulePath) {
    gutil.log(
      chalk.red('Local assemble not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install assemble'));
    process.exit(1);
  }

  if (!env.configPath) {
    gutil.log(chalk.red('No assemblefile found'));
    process.exit(1);
  }

  // check for semver difference between cli and local installation
  if (semver.gt(cliPackage.version, env.modulePackage.version) && shouldLog) {
    gutil.log(chalk.red('Warning: assemble version mismatch:'));
    gutil.log(chalk.red('Global assemble is', cliPackage.version));
    gutil.log(chalk.red('Local assemble is', env.modulePackage.version));
  }

  // chdir before requiring assemblefile to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    gutil.log('Working directory changed to', chalk.magenta(tildify(env.cwd)));
  }

  // this is what actually loads up the assemblefile
  require(env.configPath);
  gutil.log('Using assemblefile', chalk.magenta(tildify(env.configPath)));

  var assembleInst = require(env.modulePath);
  logEvents(assembleInst);

  process.nextTick(function () {
    if (simpleTasksFlag) {
      return logTasksSimple(env, assembleInst);
    }
    if (tasksFlag) {
      return logTasks(env, assembleInst);
    }
    assembleInst.start.apply(assembleInst, toRun);
  });
}

function logTasks(env, localAssemble) {
  var tree = taskTree(localAssemble.tasks);
  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
  archy(tree)
    .split('\n')
    .forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}

function logTasksSimple(env, localAssemble) {
  console.log(Object.keys(localAssemble.tasks)
    .join('\n')
    .trim());
}

// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}

// wire up logging events
function logEvents(assembleInst) {

  // total hack due to fucked up error management in orchestrator
  assembleInst.on('err', function () {
    failed = true;
  });

  assembleInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
  });

  assembleInst.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    );
  });

  assembleInst.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log(
      '\'' + chalk.cyan(e.task) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    gutil.log(msg);
  });

  assembleInst.on('task_not_found', function (err) {
    gutil.log(
      chalk.red('Task \'' + err.task + '\' is not in your assemblefile')
    );
    gutil.log('Please check the documentation for proper assemblefile formatting');
    process.exit(1);
  });
}
