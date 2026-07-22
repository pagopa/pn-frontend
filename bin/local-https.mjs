import { execFileSync } from "node:child_process";
import { X509Certificate } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CERTIFICATE_ROOT = path.join(
	os.homedir(),
	".pn-local-https",
	"certificates",
);

const getCertificatePaths = (host) => {
	const directory = path.join(CERTIFICATE_ROOT, host);

	return {
		directory,
		cert: path.join(directory, "cert.pem"),
		key: path.join(directory, "key.pem"),
	};
};

const isCertificateValid = (host, certPath, keyPath) => {
	if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
		return false;
	}

	try {
		const certificate = new X509Certificate(fs.readFileSync(certPath));

		return (
			Date.now() < Date.parse(certificate.validTo) &&
			Boolean(certificate.checkHost(host))
		);
	} catch {
		return false;
	}
};

const generateCertificate = (host, paths) => {
	fs.mkdirSync(paths.directory, { recursive: true });

	execFileSync(
		"mkcert",
		["-cert-file", paths.cert, "-key-file", paths.key, host],
		{
			stdio: "inherit",
		},
	);
};

export const getLocalHttpsOptions = (configuredHost) => {
	const host = configuredHost?.trim() || "localhost";
	const paths = getCertificatePaths(host);

	try {
		if (!isCertificateValid(host, paths.cert, paths.key)) {
			generateCertificate(host, paths);
		}

		return {
			cert: fs.readFileSync(paths.cert, "utf8"),
			key: fs.readFileSync(paths.key, "utf8"),
		};
	} catch (error) {
		const causeMessage = error instanceof Error ? error.message : String(error);

		console.warn(
			`\n⚠️  [local-https] Unable to generate a trusted HTTPS certificate for "${host}".\n` +
				`The dev server will use Vite basic SSL fallback.\n` +
				`Cause: ${causeMessage}\n`,
		);

		return undefined;
	}
};

