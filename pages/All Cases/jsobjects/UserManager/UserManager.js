export default {
    onPageLoad() {
        // Use storeValue() method instead of direct assignment
        storeValue('name', appsmith.store.name || appsmith.store.login_username || 'unknown_user');
        console.log('User set to:', appsmith.store.name);
    },
    
    ensureUserSet() {
        if (!appsmith.store.name) {
            storeValue('name', appsmith.store.name || appsmith.store.login_username || 'unknown_user');
        }
        return appsmith.store.name;
    }
}