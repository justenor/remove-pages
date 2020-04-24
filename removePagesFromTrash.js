const REMOVE_PAGE_INTERVAL = 10000

const HOOKS = {
  SITE_LIST_ITEM_MENU: 'site-list-item-menu',
  REMOVE_ICON: 'quick-actions-action-remove-from-trash',
  REMOVE_DIALOG: 'remove-from-trash-dialog-functional-layout',
  CONFIRMATION_BUTTON: 'confirmation-button',
  SITE_LIST: 'site-list'
}

const selectByHook = (hook, container = document) =>
  container.querySelector(`[data-hook="${hook}"]`)

const selectAllPages = () =>
  document.querySelectorAll(`[data-hook="site-list-item"]`)

const clickSiteListItemMenu = page =>
  selectByHook(HOOKS.SITE_LIST_ITEM_MENU, page).click()

const clickRemoveIcon = page => selectByHook(HOOKS.REMOVE_ICON, page).click()

const clickConfirmationButton = () =>
  selectByHook(HOOKS.CONFIRMATION_BUTTON).click()

const isRemoveIconDisabled = page =>
  !!selectByHook(HOOKS.REMOVE_ICON, page).querySelector(
    '[data-disabled="true"]'
  )

const waitForConfirmationDialog = () => {
  let interval = null

  return new Promise(function(resolve, reject) {
    interval = setInterval(function() {
      if (selectByHook(HOOKS.REMOVE_DIALOG)) {
        clearInterval(interval)
        resolve()
      }
    }, 1000)
  })
}

const removePage = async page => {
  clickRemoveIcon(page)

  await waitForConfirmationDialog()
  clickConfirmationButton()
}

const isPageRemovable = page => {
  if (!selectByHook(HOOKS.REMOVE_ICON, page)) {
    clickSiteListItemMenu(page)
  }

  return !isRemoveIconDisabled(page)
}

const removePagesFromTrash = async () => {
  let interval
  interval = setInterval(async () => {
    const pages = Array.from(selectAllPages())
    const removablePage = pages.find(isPageRemovable)

    if (removablePage) {
      await removePage(removablePage)
    } else {
      clearInterval(interval)
    }
  }, REMOVE_PAGE_INTERVAL)
}
