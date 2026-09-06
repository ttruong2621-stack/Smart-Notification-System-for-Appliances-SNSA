import {test, expect } from "@playwright/test"

import {
  MakeUser,
  Delete,
  signUp,
  mockBluetooth,
  addDevice,
  addSound,
} from "../helper/auths"

test("a sound can be recorded again", async ({ page }) => {
  await mockBluetooth(page)
  await page.goto("/")

  const user = MakeUser()

  try {
    await signUp(page, user)
    await addDevice(page, "Kitchen SNSA")
    await addSound(page, "Test Sound")

    const soundCard = page.getByRole("button", {
      name: /Test Sound/,
    })

    await expect(soundCard).toBeVisible()
    await soundCard.click()

    await expect(
      page.getByRole("heading", {
        name: "Sound Settings",
      })
    ).toBeVisible()


    await page.getByRole("button", { name: "Record Sound Again"}).click()

    await page
      .getByRole("button", { name: "Start Recording" })
      .click()

    await expect(page.getByText("Starting...")).toBeVisible()
    await expect(page.getByText("Recording...")).toBeVisible()
    await expect(page.getByText("Processing...")).toBeVisible()
    await expect(page.getByText("Uploading...")).toBeVisible()
    await expect(page.getByText("Complete")).toBeVisible()


    await expect(page.getByText("Sound file updated successfully")).toBeVisible()

  } finally {
    await Delete(page, user)
  }
})