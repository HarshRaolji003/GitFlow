// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from "child_process";
import { promisify } from "util";
import * as vscode from "vscode";

const execAsync = promisify(exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("GitFlow extension activated!");

  // Command 1: Hello World (KEEP THIS)
  const helloWorldCmd = vscode.commands.registerCommand(
    "gitflow.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from GitFlow!");
    }
  );

  // Command 2: Commit visualizer
  const showCommitsCmd = vscode.commands.registerCommand(
    "gitflow.showCommits",
    showCommitHistory
  );

  context.subscriptions.push(helloWorldCmd, showCommitsCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function showCommitHistory() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (!workspaceFolder) {
    vscode.window.showErrorMessage("Open a workspace folder first.");
    return;
  }

  const cwd = workspaceFolder.uri.fsPath;

  try {
    // Git command: last 20 commits with branch graph
    const { stdout } = await execAsync(
      "git log --oneline --graph --decorate -n 20",
      { cwd }
    );

    const output = vscode.window.createOutputChannel("GitFlow Commits");
    output.clear();
    output.appendLine("=== GitFlow: Commit History ===\n");
    output.appendLine(stdout);
    output.show(true);
  } catch (error: any) {
    vscode.window.showErrorMessage("GitFlow Error: " + error.message);
  }
}
