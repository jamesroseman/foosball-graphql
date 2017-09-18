/* tslint:disable:no-console */
// From react-boilerplate/react-boilerplate/server/logger.js

import * as chalk from "chalk";
import * as ip from "ip";

const divider = chalk.gray("\n-----------------------------------");

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {
  // Called when express.js app starts on given port w/o errors
  appStarted: (port: number|string|boolean, host: string, tunnelStarted: boolean = true) => {
    console.log(`Server started ! ${chalk.green("✓")}`);

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(`Tunnel initialised ${chalk.green("✓")}`);
    }

    console.log(`
      ${chalk.bold("Access URLs:")}${divider}
      Localhost: ${chalk.magenta(`http://${host}:${port}`)}
            LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) +
      (tunnelStarted ? `\n    Proxy: ${chalk.magenta("✓")}` : "")}${divider}
      ${chalk.blue(`Press ${chalk.italic("CTRL-C")} to stop`)}
    `);
  },

  // Called whenever there's an error on the server we want to print
  error: (err: any) => {
    console.error(chalk.red(err));
  },
};

export default logger;
