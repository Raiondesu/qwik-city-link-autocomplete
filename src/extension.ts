import * as vscode from 'vscode';
import { providers } from './providers';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(...providers);
}

export function deactivate() {
	providers.forEach(p => p.dispose());
}