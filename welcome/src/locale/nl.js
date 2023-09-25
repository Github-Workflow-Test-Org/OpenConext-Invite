const nl = {
    code: "NL",
    name: "Nederlands",
    select_locale: "Wissel taal naar Engels",
    landing: {
        header: {
            title: "Toegang tot je applicaties",
            login: "Login",
            sup: "SURFconext Invite is by invite only.",
        },
        works: "Hoe werkt het?",
        adminFunction: "adminfunctie",
        info: [
            //Arrays of titles and info blocks and if a function is an admin function
            ["Invites", "<p>SURF invites institution managers who can create roles for their applications.</p>" +
            "<p>Applications are services connected to SURFconext.</p>", true],
            ["Roles", "<p>The application managers will invite colleagues for roles who can invite guests.</p>" +
            "<p>Invites.</p>", true],
            ["Join", "<p>Invited colleagues who accept the invitation are granted access rights for the applications.</p><br/>", false],
            ["Groups", "<p>The roles are actually group memberships that can be provisioned to external SCIM API's.</p>", false]
        ],
        footer: "<p>SURFconext Invite biedt toegangsbeheer voor het Nederlandse onderwijs en onderzoek.</p>" +
            "<p>Meer weten? <a href='https://support.surfconext.nl/invite'>Lees verder</a>.</p>",
    },
    header: {
        title: "SURFconext Invite",
        subTitle: "Alles gaat uilstekend",
        links: {
            login: "Login",
            switchApp: "Ga naar {{app}}",
            welcome: "Welkom",
            access: "Invite",
            help: "Help",
            profile: "Profiel",
            logout: "Log uit",
            helpUrl: "https://support.surfconext.nl/help-invite-nl"
        },
    },
    home: {
        access: "SURFconext Invite",
    },
    users: {
        roles: "Applicaties",
        noRolesInfo: "You have no applications (which means you must be super-user)",
        noRolesFound: "You have not been invited for any guest roles for educational applications",
        rolesInfo: "You have access to the following applications.",
        expiryDays: "Expiry days"
    },
    forms: {
        ok: "Ok",
        and: "en",
        more: "Meer",
        less: "Minder",
        error: "Je kunt <a href=\"mailto:support@surfconext.nl\">contact opnemen</a> voor meer informartie.<br/><br/>" +
            "Het foutmeldingsnummer is {{reference}}."
    },
    profile: {
        welcome: "Welkom, {{name}}",
        info: "Hier zijn de applicaties waar je via SURFconext Invite toegang toe hebt.",
        toaster: "Je bent ingelogd via {{institution}} (",
        changeThis: "wijzig",
        tooltipApps: "Je hebt toegang gekregen tot deze applicaties via een uitnodiging"
    },
    inviteOnly: {
        welcome: "Welkom bij SURFconext Invite",
        roles: "Je hebt nog geen rollen.",
        info: "Deze applicatie is op uitnodiging. Heb je hierover vragen? Neem <a href='mailto:support@surfconext.nl'>contact met ons op</a>.",
        preLogin: "Of ",
        login: "login",
        postLogin: " via een andere instelling",
    },
    missingAttributes: {
        welcome: "Welkom bij SURFconext Invite",
        attributes: "Je instelling gaf niet alle benodigde attributen vrij. De volgende ontbreken:",
        info: "Hulp nodig? Neem <a href='mailto:support@surfconext.nl'>contact met ons op</a>.",
        preLogin: "Of ",
        login: "login",
        postLogin: " via een andere instelling",
    },
    invitationAccept: {
        hi: "Hoi{{name}},",
        nextStep: "Volgende: veel plezier met je nieuwe rol",
        expired: "Deze uitnodiging is verlopen op {{expiryDate}}",
        expiredInfo: "Neem contact op met degene die je uitnodigde en vraag hen je een nieuwe uitnodiging te sturen.",
        enforceEmailEquality: " Deze uitnodiging kan alleen geaccepteerd worden door <strong>{{email}}</strong>.",
        invited: "Uitgenodigd voor {{plural}} {{roles}} door {{inviter}}.",
        role: "rol",
        roles: "rollen",
        progress: "1",
        info: "SURFconext Invite geeft toegang tot applicaties op basis van je rol.",
        infoLogin: "Je kunt inloggen met je instellings-account of eduID.",
        infoLoginEduIDOnly: "Je moet inloggen met eduID.",
        infoLoginAgain: "Om de uitnodiging te accepteren moet je opnieuw inloggen.",
        login: "Login",
        loginWithSub: "Login",
        emailMismatch: "De uitnodiger heeft aangegeven dat je de uitnodiging dient te accepteren met e-mailadres {{email}}, " +
            "maar je bent ingelogd met een account met een ander mailadres. Log opnieuw in met een ander account."
    },
    proceed: {
        info: "Gefeliciteerd! Je hebt de {{plural}} {{roles}} geaccepteerd en kunt nu verder naar de applicatie",
        progress: "2",
        goto: "Open applicatie",
        nextStep: "Volgende: ga naar de applicatie",
        launch: "Open",
        new: "Nieuw"
    },
    tooltips: {
    },
    confirmationDialog: {
        title: "Bevestig",
        error: "Fout",
        subTitle: "Deze actie vereist bevestiging",
        subTitleError: "Er is een fout opgetreden",
        confirm: "Bevestig",
        ok: "OK",
        cancel: "Annuleer",
    },
    footer: {
        terms: "Gebruiksvoorwaarden",
        termsLink: "https://support.surfconext.nl/terms-nl",
        privacy: "Privacybeleid",
        privacyLink: "https://support.surfconext.nl/privacy-nl",
        surfLink: "https://surf.nl",
    },
    expirations: {
        expires: "Verloopt {{relativeTime}}",
        expired: "Verlopen {{relativeTime}}",
        never: "Verloopt niet",
        activity: {
            now: "Zojuist",
            seconds: "Vandaag",
            minute: "Vandaag",
            minutes: "Vandaag",
            hour: "Vandaag",
            hours: "Vandaag",
            day: "Gisteren",
            days: "Deze week",
            week: "Deze week",
            weeks: "Deze maand",
            month: "Vorige maand",
            months: "%s maanden geleden",
            year: "1 jaar geleden",
            years: "%s jaar geleden"
        },
        ago: {
            now: "zojuist",
            seconds: "%s seconden geleden",
            minute: "1 minuut geleden",
            minutes: "%s minuten geleden",
            hour: "1 uur geleden",
            hours: "%s uren geleden",
            day: "1 dag geleden",
            days: "%s dagen geleden",
            week: "1 week geleden",
            weeks: "%s weken geleden",
            month: "1 maand geleden",
            months: "%s maanden geleden",
            year: "1 jaar geleden",
            years: "%s jaren geleden"
        },
        in: {
            now: "zojuist",
            seconds: "over %s seconden",
            minute: "over 1 minuut",
            minutes: "over %s minuten",
            hour: "over 1 uur",
            hours: "over %s uur",
            day: "over 1 dag",
            days: "over %s dagen",
            week: "over 1 week",
            weeks: "over %s weken",
            month: "over 1 maand",
            months: "over %s maanden",
            year: "over 1 jaar",
            years: "over %s jaar"
        }
    },
    notFound: {
        alt: "404 Pagina niet gevonden"
    }
}

export default nl;
