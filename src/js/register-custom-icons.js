wp.domReady( () => {
    const { __ } = wp.i18n;
    const { addFilter } = wp.hooks;

    function addCustomIcons( icons ) {
        const customIcons = [
            {
				isDefault: true,
				name: 'bookmark',
				title: __( 'Bookmark', 'ankur-eichefam' ),
				icon: '<svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M15.5,4.25 L9,4.25 C7.48121644,4.25 6.25,5.48121644 6.25,7 L6.25,19.5 L6.25678483,19.6039817 C6.33269168,20.17682 7.02861659,20.4632798 7.48809353,20.0694425 L12.25,15.988 L17.0119065,20.0694425 C17.4984115,20.4864467 18.25,20.1407649 18.25,19.5 L18.25,7 C18.25,5.48120782 17.0188049,4.25 15.5,4.25 Z M15.5,5.75 L15.6278083,5.75645347 C16.2581415,5.82046462 16.75,6.3527795 16.75,7 L16.75,17.869 L12.7380935,14.4305575 L12.63989,14.3592262 C12.3667749,14.1927863 12.0115663,14.2165634 11.7619065,14.4305575 L7.75,17.868 L7.75,7 C7.75,6.30964356 8.30964356,5.75 9,5.75 L15.5,5.75 Z"></path></svg>',
				categories: [ 'category-one' ],
			},
        ];

        const customIconCategories = [
            {
				name: 'category-one',
				title: __( 'Category One', 'ankur-eichefam' ),
			},
        ];

        const customIconType = [
            {
				isDefault: true,
				type: 'example-icons',
				title: __( 'Example Icons', 'ankur-eichefam' ),
				icons: customIcons,
				categories: customIconCategories,
			},
        ];

        const allIcons = [].concat( icons, customIconType );

        return allIcons;
    }

    addFilter(
        'iconBlock.icons',
        'ankur-eichefam/custom-icons',
        addCustomIcons
    )
} );