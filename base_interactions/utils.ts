import { Locator, Page, expect } from "@playwright/test";
import { ai } from "ai-wright";
import path from "path";
import fs from "fs";

export async function wait_for_element_to_be_checked(
  page: Page,
  test: any,
  ai: any,
  locator: string,
  timeout: number = 10000,
): Promise<boolean> {
  // Wait for the element to be checked
  //  Keep waiting and check after every 1 second
  while (timeout > 0) {
    await page.waitForTimeout(1000);
    timeout -= 1000;
    if (await page.locator(locator).isChecked()) {
      return true;
    }
  }
  return false;
}

export async function select_checkbox(
  page: Page,
  test: any,
  ai: any,
  locator: string,
  timeout: number = 10000,
) {
  await page.locator(locator).waitFor({ state: "visible", timeout: timeout });
  // Click the checkbox
  await page.locator(locator).click();
  await wait_for_element_to_be_checked(page, test, ai, locator, timeout);
}

/*
########################
All Wait Functionalities 
*/

export async function wait_for_loadState(
  page: Page,
  test: any,
  ai: any,
  load_state: "load" | "domcontentloaded" | "networkidle" = "load",
  default_static_wait: number = 1000,
  timeout: number = 30000,
) {
  await page.waitForTimeout(default_static_wait);
  await page.waitForLoadState(load_state, { timeout: timeout });
}

export async function wait_for_element_to_be_absent(
  page: Page,
  test: any,
  ai: any,
  locator: string,
  timeout: number = 10000,
) {
  await wait_for_loadState(page, test, ai);

  for (let i = 0; i < timeout; i += 1000) {
    await page.waitForTimeout(1000);
    if ((await page.locator(locator).first().isVisible()) === false) {
      return true;
    }
  }
}

export async function waitForTextEquals(
  page: Page,
  test: any,
  ai: any,
  {
    locator,
    expectedText,
    timeout = 10000,
    pollInterval = 1000,
  }: {
    locator: string;
    expectedText: string;
    timeout?: number;
    pollInterval?: number;
  },
) {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    try {
      const actualText = (await page.locator(locator).textContent())?.trim();

      if (actualText === expectedText) {
        return true;
      }
    } catch (err) {
      // ignore transient DOM issues
    }

    await new Promise((res) => setTimeout(res, pollInterval));
  }

  return false;
}

/*
All Wait Functionalities
######################## 
*/

/*
######################## 
All Dropdown Functionalities
*/

export async function selectFromCustomDropdown(
  page: Page,
  test: any,
  ai: any,
  option: {
    dropdownTrigger: string;
    optionText: string;
  },
) {
  await page.locator(option.dropdownTrigger).click();
  await wait_for_loadState(page, test, ai);

  const option_element = await page
    .getByText(option.optionText, { exact: false })
    .first();

  await option_element.click();
}

/*
All Dropdown Functionalities
######################## 
*/

export async function get_xpath_from_visible_text(
  page: Page,
  test: any,
  ai: any,
  visible_text: string,
): Promise<string | null> {
  await wait_for_loadState(page, test, ai);

  const tags = [
    "div",
    "button",
    "li",
    "a",
    "span",
    "select",
    "option",
    "input",
    "textarea",
    "label",
    "th",
    "td",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "strong",
  ];

  for (const tag of tags) {
    const xpath = `//${tag}[normalize-space()='${visible_text}']`;
    const locator = page.locator(xpath).first();

    // 🔥 Instant DOM check (no waiting)
    if ((await locator.count()) === 0) continue;

    // 🔥 Instant visibility check (no waiting)
    const isVisible = await locator
      .evaluate((el) => {
        const style = window.getComputedStyle(el);
        return (
          style &&
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          el.getClientRects().length > 0
        );
      })
      .catch(() => false);

    if (isVisible) {
      return xpath;
    }
  }

  return null;
}

/*
######################## 
All File Functionalities
*/

export function get_files_from_directory(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .map((file) => path.join(directory, file))
    .filter((file) => fs.statSync(file).isFile());
}

export async function readJSONFile(fileName: string) {
  const current_dir = process.cwd();
  const file_path = path.join(current_dir, fileName);
  return JSON.parse(fs.readFileSync(file_path, "utf-8"));
}

export async function download_file(
  page: Page,
  test: any,
  ai: any,
  downloadLocator: Locator,
  options: {
    fileName: string;
    timeout?: number;
  },
): Promise<string> {
  const timeout = options.timeout || 30000;

  const downloadFolder = path.join(
    process.cwd(),
    "temp_data",
    process.env.PROJECT_NAME || "temp_default_downloads",
  );

  try {
    // 1️⃣ Ensure folder exists
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder, { recursive: true });
    }

    const fullPath = path.join(downloadFolder, options.fileName);

    // 2️⃣ Remove old file
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Old file removed: ${fullPath}`);
    }

    console.log(`⬇️ Initiating download to: ${fullPath}`);

    // 3️⃣ Trigger + wait
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout }),
      downloadLocator.click(),
    ]);

    // 4️⃣ Save file
    await download.saveAs(fullPath);

    // 5️⃣ Validate
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ Download successful: ${fullPath}`);
      console.log(`📦 File size: ${stats.size} bytes`);
      return fullPath;
    } else {
      console.error(`❌ Download failed. File not found at: ${fullPath}`);
      throw new Error(`Download failed. File not found at: ${fullPath}`);
    }
  } catch (error: any) {
    console.error(`❌ Download error: ${error.message}`);
    throw error; // Important: let test fail properly
  }
}

export function delete_file_if_exists(
  folderPath: string,
  fileName: string,
): void {
  const fullPath = path.join(folderPath, fileName);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted existing file: ${fullPath}`);
  } else {
    console.log(`File not found, nothing to delete: ${fullPath}`);
  }
}

export async function uploadFile(
  page: Page,
  inputXpath: string,
  relativeFilePath: string,
  options?: {
    timeout?: number;
    waitForAttached?: boolean;
  },
): Promise<void> {
  const timeout = options?.timeout ?? 10000;
  const waitForAttached = options?.waitForAttached ?? true;

  const input: Locator = page.locator(inputXpath);
  const absolutePath = path.resolve(relativeFilePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Upload file not found: ${absolutePath}`);
  }

  if (waitForAttached) {
    await input.waitFor({ state: "attached", timeout });
  }

  await input.setInputFiles(absolutePath);
}

export async function initializeMemoryJSON() {
  const currentWorkingDirectory = process.cwd();
  const memory_json_file = path.resolve(
    `${currentWorkingDirectory}/temp_data/${process.env.PROJECT_NAME}/memory.json`,
  );

  let data: Record<string, any> = {};
  fs.writeFileSync(memory_json_file, JSON.stringify(data));
}

export async function getInMemoryJSON(key: string) {
  const currentWorkingDirectory = process.cwd();
  const memory_json_file = path.resolve(
    `${currentWorkingDirectory}/temp_data/${process.env.PROJECT_NAME}/memory.json`,
  );

  let data: Record<string, any> = {};

  // Read existing JSON
  try {
    data = JSON.parse(fs.readFileSync(memory_json_file, "utf-8"));
  } catch (err) {
    // File may not exist initially
    console.log(err);
  }

  // Return the value
  return data[key];
}

export async function saveInMemoryJSON(
  key: string,
  value: any,
  mode: "replace" | "append" = "replace",
) {
  const currentWorkingDirectory = process.cwd();

  const memory_json_file = path.resolve(
    `${currentWorkingDirectory}/temp_data/${process.env.PROJECT_NAME}/memory.json`,
  );

  // Ensure file exists
  if (!fs.existsSync(memory_json_file)) {
    fs.writeFileSync(memory_json_file, JSON.stringify({}, null, 2));
  }

  let data: Record<string, any> = {};

  try {
    const rawData = fs.readFileSync(memory_json_file, "utf-8");
    data = rawData.trim() ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("❌ Failed to read memory.json:", error);
    data = {};
  }

  // =========================
  // KEY LOGIC CHANGE HERE
  // =========================

  if (mode === "append") {
    if (!data[key]) {
      data[key] = [];
    }

    if (!Array.isArray(data[key])) {
      data[key] = [data[key]];
    }

    data[key].push(value);
  } else {
    data[key] = value;
  }

  // Write back
  fs.writeFileSync(memory_json_file, JSON.stringify(data, null, 2), "utf-8");

  console.log(`✅ Saved to memory.json [${mode}]: ${key}`);
}

/*
All File Functionalities
######################## 
*/

/*
######################## 
All random generator helpers
*/

export function getRandomItem<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/*
All random generator helpers
######################## 
*/

/*
######################## 
All UI interaction helpers
*/

export async function jsClick(
  page: Page,
  test: any,
  ai: any,
  locator: string,
  timeout: number = 10000,
) {
  const continueBtn = page.locator(locator);
  await continueBtn.evaluate((el: HTMLElement) => el.click());
}

/*
All UI interaction helpers
######################## 
*/

export async function aiVerify(
  page: Page,
  test: any,
  ai: any,
  options: {
    objective: string;
    confidence_threshold: number;
  },
): Promise<{
  verificationSuccess: boolean;
  confidence: number;
  verificationReason: string | undefined;
}> {
  try {
    const result = await ai.verify(
      options.objective,
      { page, test },
      { confidence_threshold: options.confidence_threshold },
    );
    // Print the Objective for the AI
    // console.log(`\n\nAI Verification Objective: ${options.objective}\n\n`);

    // Print a AI verification Success message with the objective and result
    console.log(
      `\n\n✅ AI Verification Success: ${result.verificationSuccess}`,
    );
    console.log(`\n\nAI Verification Confidence: ${result.confidence}`);
    console.log(`\n\nAI Verification Reason: ${result.verificationReason}`);
    return result;
  } catch (error: any) {
    console.error(`❌ AI Verification failed: ${error.message}`);
    return {
      verificationSuccess: false,
      confidence: 0,
      verificationReason: error.message,
    };
  }
}

/*
All Network Capture helpers
######################## 
*/

export function startNetworkCapture(page: Page): any[] {
  const networkCalls: any[] = [];

  page.on("request", (request) => {
    networkCalls.push({
      timestamp: new Date().toISOString(),
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
    });
  });

  return networkCalls;
}

export function saveNetworkCalls(networkCalls: any[]) {
  const currentWorkingDirectory = process.cwd();
  const networkCallsFile = path.resolve(
    `${currentWorkingDirectory}/temp_data/${process.env.PROJECT_NAME}/network_calls.json`,
  );

  fs.writeFileSync(networkCallsFile, JSON.stringify(networkCalls, null, 2));
}
