#
# fmodeler.py
#
# Created by Mathieu Delehaye on 24/03/2024.
#
# FintechModeler: A Python and C++ library for fintech modeling.
#
# Copyright © 2023 Mathieu Delehaye. All rights reserved.
#
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General
# Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
# for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see
# <https:www.gnu.org/licenses/>.

import argparse
import os
import sys
import traceback

from scripts.app_launcher import AppLauncher


def __parse_args(args: list[str]) -> argparse.Namespace:
    """Parse command line arguments.

    Args:
        args (list): The command line arguments passed into the program.
    """

    script_path = os.path.dirname(os.path.realpath(__file__))

    parser = argparse.ArgumentParser(prog="fmodeler.py")

    parser.add_argument(
        "--version",
        type=str,
        help="the version of the application",
    )

    return parser.parse_args(args)


def main(args: argparse.Namespace) -> None:
    """Main function.

    Args:
        args (argparse result): The parsed arguments passed into the program.
    """

    try:
        if args.version:
            print(f"FintechModeler version 1.0.0")
            sys.exit(0)

        launcher = AppLauncher()
        launcher.run()

    # pylint: disable=broad-except
    except Exception:
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main(__parse_args(sys.argv[1:]))
