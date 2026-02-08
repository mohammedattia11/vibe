/**
 * Fetch all files from GitHub repository recursively
 * Returns a map of filepath -> SHA for comparison
 */
export async function fetchRemoteFileSHAs(
  octokit: any,
  owner: string,
  repo: string,
  treeSha: string,
): Promise<Map<string, string>> {
  const remoteFiles = new Map<string, string>();

  try {
    // Fetch the full recursive tree (recursive: true gets all nested files)
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "true",
    });

    // Map each file to its SHA
    treeData.tree.forEach(
      (item: { path: string; sha: string; type: string }) => {
        if (item.type === "blob") {
          remoteFiles.set(item.path, item.sha);
        }
      },
    );
  } catch (error) {
    // If fetch fails, return empty map to force re-upload all files
    console.warn(
      "Failed to fetch remote tree, will re-upload all files:",
      error,
    );
  }

  return remoteFiles;
}