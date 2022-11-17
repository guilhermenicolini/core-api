type EnvType = {
  version: string
}

export const env: EnvType = {
  version: process.env.npm_package_version as string
}
