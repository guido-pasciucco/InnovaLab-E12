import { test, expect } from '@playwright/test'

test.describe('Pruebas de Login', () => {
  test('Debe mostrar el formulario', async ({ page }) => {
    await page.goto('/login')

    const boton = page.getByTestId('btn-login')

    await expect(boton).toBeVisible()

    await boton.click()
  })

  test('Debe rechazar credenciales incorrectas', async ({ page }) => {
    await page.goto('/login')

    await page.getByTestId('ingresar').fill('incorrecto@gmail.com')
    await page.getByTestId('contrasena').fill('123456')

    await page.getByTestId('btn-login').click()

    await expect(page.getByText(/incorrectos|inválidos/i)).toBeVisible()
  })

  test('Debe ingresar como administrador', async ({ page }) => {
    await page.goto('/login')

    await page.getByTestId('btn-credencial-administrador').click()

    await page.getByTestId('btn-login').click()

    // Verificar que navegue al dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('Debe ingresar como coordinador', async ({ page }) => {
    await page.goto('/login')

    await page.getByTestId('btn-credencial-coordinador').click()

    await page.getByTestId('btn-login').click()

    // Verificar que navegue al dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
