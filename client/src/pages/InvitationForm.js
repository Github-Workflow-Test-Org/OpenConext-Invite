import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppStore} from "../stores/AppStore";
import I18n from "../locale/I18n";
import {
    allowedAuthoritiesForInvitation,
    AUTHORITIES,
    highestAuthority,
    isUserAllowed,
    markAndFilterRoles
} from "../utils/UserRole";
import {ReactComponent as UserIcon} from "@surfnet/sds/icons/functional-icons/id-2.svg";
import {ReactComponent as UpIcon} from "@surfnet/sds/icons/functional-icons/arrow-up-2.svg";
import {ReactComponent as DownIcon} from "@surfnet/sds/icons/functional-icons/arrow-down-2.svg";
import {newInvitation, rolesByApplication} from "../api";
import {Button, ButtonType, Loader, Tooltip} from "@surfnet/sds";
import "./InvitationForm.scss";
import {UnitHeader} from "../components/UnitHeader";
import InputField from "../components/InputField";
import {isEmpty, stopEvent} from "../utils/Utils";
import ErrorIndicator from "../components/ErrorIndicator";
import SelectField from "../components/SelectField";
import {DateField} from "../components/DateField";
import EmailField from "../components/EmailField";
import {displayExpiryDate, futureDate} from "../utils/Date";
import {RoleCard} from "../components/RoleCard";
import SwitchField from "../components/SwitchField";

export const InvitationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {user, setFlash, config} = useAppStore(state => state);

    const [guest, setGuest] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [originalRoleId, setOriginalRoleId] = useState(null);
    const [invitation, setInvitation] = useState({
        expiryDate: futureDate(30),
        roleExpiryDate: futureDate(366),
        invites: [],
        intendedAuthority: AUTHORITIES.GUEST
    });
    const [displayAdvancedSettings, setDisplayAdvancedSettings] = useState(false);
    const [loading, setLoading] = useState(true);
    const [customExpiryDate, setCustomExpiryDate] = useState(false);
    const [customRoleExpiryDate, setCustomRoleExpiryDate] = useState(false);
    const [initial, setInitial] = useState(true);
    const required = ["intendedAuthority", "invites"];

    useEffect(() => {
        if (!isUserAllowed(AUTHORITIES.INVITER, user)) {
            navigate("/404");
            return;
        }
        if (isUserAllowed(AUTHORITIES.MANAGER, user)) {
            rolesByApplication()
                .then(res => {
                    const markedRoles = markAndFilterRoles(user, res, I18n.locale, I18n.t("roles.multiple"), I18n.t("forms.and"));
                    setInitialRole(markedRoles);
                    setRoles(markedRoles);
                    setLoading(false);
                })
        } else {
            const markedRoles = markAndFilterRoles(user, [], I18n.locale, I18n.t("roles.multiple"), I18n.t("forms.and"));
            setInitialRole(markedRoles);
            setRoles(markedRoles)
            setLoading(false);
        }
        const breadcrumbPath = [
            {path: "/home", value: I18n.t("tabs.home")},
            {path: "/home/roles", value: I18n.t("tabs.roles")},
        ];
        useAppStore.setState({breadcrumbPath: breadcrumbPath});
    }, [user]);// eslint-disable-line react-hooks/exhaustive-deps


    const setInitialRole = markedRoles => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const isGuest = urlSearchParams.get("maintainer") !== "true";
        setGuest(isGuest)
        const initialRole = markedRoles.find(role => role.value === location.state);
        if (initialRole) {
            // See markAndFilterRoles - we are mixing up userRoles and roles
            const defaultExpiryDays = initialRole.isUserRole ? initialRole.role.defaultExpiryDays : initialRole.defaultExpiryDays;
            setSelectedRoles([initialRole])
            setInvitation({
                ...invitation,
                intendedAuthority: isGuest ? AUTHORITIES.GUEST : AUTHORITIES.INVITER,
                enforceEmailEquality: initialRole.enforceEmailEquality,
                eduIDOnly: initialRole.eduIDOnly,
                roleExpiryDate: futureDate(defaultExpiryDays)
            })
            setOriginalRoleId(initialRole.isUserRole ? initialRole.role.id : initialRole.id);
        } else {
            if (markedRoles.length === 1) {
                setSelectedRoles(markedRoles);
            }
            setInvitation({
                ...invitation,
                intendedAuthority: isGuest ? AUTHORITIES.GUEST : AUTHORITIES.INVITER
            })
        }
    }

    const toggleDisplayAdvancedSettings = e => {
        stopEvent(e);
        setDisplayAdvancedSettings(!displayAdvancedSettings);
    }

    const submit = () => {
        setInitial(false);
        if (isValid()) {
            const invitationRequest = {...invitation, roleIdentifiers: selectedRoles.map(role => role.value)};
            setLoading(true);
            newInvitation(invitationRequest)
                .then(() => {
                    setLoading(false);
                    setFlash(I18n.t("invitations.createFlash"));
                    if (originalRoleId) {
                        navigate(`/roles/${originalRoleId}/invitations`);
                    } else if (!isEmpty(invitationRequest.roleIdentifiers)) {
                        navigate(`/roles/${invitationRequest.roleIdentifiers[0]}/invitations`);
                    } else {
                        navigate(-1);
                    }
                });
        }
    }

    const isValid = () => {
        return required.every(attr => !isEmpty(invitation[attr])) &&
            (!isEmpty(selectedRoles) || [AUTHORITIES.SUPER_USER, AUTHORITIES.INSTITUTION_ADMIN].includes(invitation.intendedAuthority));
    }

    const addEmails = emails => {
        const newEmails = [...new Set(invitation.invites.concat(emails))]
        setInvitation({...invitation, invites: newEmails});
    }

    const removeMail = mail => {
        setInvitation({...invitation, invites: invitation.invites.filter(email => mail !== email)});
    }

    const defaultRoleExpiryDate = newRoles => {
        const allDefaultExpiryDays = (newRoles || [])
            .filter(role => role.defaultExpiryDays)
            .map(role => role.defaultExpiryDays)
            .sort();
        if (invitation.intendedAuthority === AUTHORITIES.GUEST) {
            return futureDate(isEmpty(allDefaultExpiryDays) ? 365 : allDefaultExpiryDays[0]);
        }
        return invitation.roleExpiryDate;
    }

    const rolesChanged = selectedOptions => {
        if (selectedOptions === null) {
            setSelectedRoles([])
            setInvitation({...invitation, enforceEmailEquality: false, eduIDOnly: false})
        } else {
            const newSelectedOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : [selectedOptions];
            setSelectedRoles(newSelectedOptions);
            const enforceEmailEquality = newSelectedOptions.some(role => role.enforceEmailEquality);
            const eduIDOnly = newSelectedOptions.some(role => role.eduIDOnly);
            setInvitation({
                ...invitation,
                enforceEmailEquality: enforceEmailEquality,
                eduIDOnly: eduIDOnly,
                roleExpiryDate: defaultRoleExpiryDate(newSelectedOptions)
            })
        }
    }

    const authorityChanged = option => {
        setInvitation({
            ...invitation,
            intendedAuthority: option.value,
            roleExpiryDate: defaultRoleExpiryDate(selectedRoles)
        });

    }

    const renderForm = isInviter => {
        const disabledSubmit = !initial && !isValid();
        const authorityOptions = allowedAuthoritiesForInvitation(user, selectedRoles)
            .map(authority => ({value: authority, label: I18n.t(`access.${authority}`)}));
        return (
            <>
                {isInviter && <div className="card-containers">
                    <span className={"label"}>
                        {I18n.t("invitations.inviterRoles")}
                        <Tooltip tip={I18n.t("tooltips.rolesTooltip")}/>
                    </span>
                    {roles.map((role, index) =>
                        <RoleCard role={role}
                                  index={index}
                                  key={index}
                                  invitationSelected={selectedRoles.some(r => r.value === role.value)}
                                  invitationSelectCallback={(e, value) => {
                                      const checked = e.target.checked;
                                      const roleSelected = roles.find(r => r.value === value);
                                      const newSelectedRoles = checked ? selectedRoles.concat(roleSelected) : selectedRoles.filter(r => r.value !== roleSelected.value);
                                      rolesChanged(newSelectedRoles);
                                  }}/>)
                    }
                    {(!initial && isEmpty(selectedRoles)) &&
                        <ErrorIndicator msg={I18n.t("invitations.requiredRole")} adjustMargin={true}/>
                    }
                </div>}


                <EmailField
                    name={I18n.t("invitations.invitees")}
                    addEmails={addEmails}
                    emails={invitation.invites}
                    isAdmin={false}
                    pinnedEmails={[]}
                    removeMail={removeMail}
                    error={!initial && isEmpty(invitation.invites)}/>

                {(!initial && isEmpty(invitation.invites)) &&
                    <ErrorIndicator msg={I18n.t("invitations.requiredEmail")}/>}

                {authorityOptions.length > 1 && <SelectField
                    value={authorityOptions.find(option => option.value === invitation.intendedAuthority)
                        || authorityOptions[authorityOptions.length - 1]}
                    options={authorityOptions}
                    name={I18n.t("invitations.intendedAuthority")}
                    searchable={false}
                    disabled={authorityOptions.length === 1}
                    onChange={authorityChanged}
                    toolTip={I18n.t("tooltips.intendedAuthorityTooltip")}
                    clearable={false}
                />}
                {!isInviter && <>
                    <SelectField value={selectedRoles}
                                 options={roles.filter(role => !selectedRoles.find(r => r.value === role.value))}
                                 name={I18n.t("invitations.roles")}
                                 toolTip={I18n.t("tooltips.rolesTooltip")}
                                 isMulti={true}
                                 error={!initial && isEmpty(selectedRoles)}
                                 searchable={true}
                                 placeholder={I18n.t("invitations.rolesPlaceHolder")}
                                 onChange={rolesChanged}/>
                    {(!initial && isEmpty(selectedRoles) &&
                            ![AUTHORITIES.SUPER_USER, AUTHORITIES.INSTITUTION_ADMIN].includes(invitation.intendedAuthority)) &&
                        <ErrorIndicator msg={I18n.t("invitations.requiredRole")}/>}
                </>}


                <InputField value={invitation.message}
                            onChange={e => setInvitation({...invitation, message: e.target.value})}
                            placeholder={I18n.t("invitations.messagePlaceholder")}
                            name={I18n.t("invitations.message")}
                            large={true}
                            multiline={true}/>

                {!displayAdvancedSettings &&
                    <a className="advanced-settings" href="/#" onClick={e => toggleDisplayAdvancedSettings(e)}>
                        {I18n.t("roles.showAdvancedSettings")}
                        <DownIcon/>
                    </a>
                }

                {displayAdvancedSettings &&
                    <div className="advanced-settings-container">
                        <a className="advanced-settings" href="/#" onClick={e => toggleDisplayAdvancedSettings(e)}>
                            {I18n.t("roles.hideAdvancedSettings")}
                            <UpIcon/>
                        </a>

                        {selectedRoles.every(role => role.overrideSettingsAllowed) &&
                            <SwitchField name={"enforceEmailEquality"}
                                         value={invitation.enforceEmailEquality || false}
                                         onChange={val => setInvitation({...invitation, enforceEmailEquality: val})}
                                         label={I18n.t("invitations.enforceEmailEquality")}
                                         info={I18n.t("tooltips.enforceEmailEqualityTooltip")}
                            />}

                        {selectedRoles.every(role => role.overrideSettingsAllowed) &&
                            <SwitchField name={"eduIDOnly"}
                                         value={invitation.eduIDOnly || false}
                                         onChange={val => setInvitation({...invitation, eduIDOnly: val})}
                                         label={I18n.t("invitations.eduIDOnly")}
                                         info={I18n.t("tooltips.eduIDOnlyTooltip")}
                            />}

                        {invitation.intendedAuthority === AUTHORITIES.GUEST &&
                            <SwitchField name={"guestRoleIncluded"}
                                         value={invitation.guestRoleIncluded || false}
                                         onChange={val => setInvitation({...invitation, guestRoleIncluded: val})}
                                         label={I18n.t("invitations.guestRoleIncluded")}
                                         info={I18n.t("tooltips.guestRoleIncludedTooltip")}
                            />
                        }
                        {selectedRoles.every(role => role.overrideSettingsAllowed) &&
                            <SwitchField name={"roleExpiryDate"}
                                         value={customRoleExpiryDate}
                                         onChange={() => {
                                             setCustomRoleExpiryDate(!customRoleExpiryDate);
                                             setInvitation({
                                                 ...invitation,
                                                 roleExpiryDate: defaultRoleExpiryDate(selectedRoles)
                                             })
                                         }}
                                         label={I18n.t("invitations.roleExpiryDateQuestion")}
                                         info={I18n.t("invitations.roleExpiryDateInfo", {
                                             expiry: displayExpiryDate(invitation.roleExpiryDate)
                                         })}
                            />
                        }
                        {customRoleExpiryDate &&
                            <DateField value={invitation.roleExpiryDate}
                                       onChange={e => setInvitation({...invitation, roleExpiryDate: e})}
                                       showYearDropdown={true}
                                       disabled={selectedRoles.some(role => !role.overrideSettingsAllowed)}
                                       pastDatesAllowed={config.pastDateAllowed}
                                       allowNull={selectedRoles.every(role => role.overrideSettingsAllowed) && invitation.intendedAuthority !== AUTHORITIES.GUEST}
                                       minDate={futureDate(1, invitation.expiryDate)}
                                       name={I18n.t("invitations.roleExpiryDate")}
                                       toolTip={I18n.t("tooltips.roleExpiryDateTooltip")}/>}

                        <SwitchField name={"expiryDate"}
                                     value={customExpiryDate}
                                     onChange={() => {
                                         setCustomExpiryDate(!customExpiryDate);
                                         setInvitation({...invitation, expiryDate: futureDate(30)})
                                     }}
                                     label={I18n.t("invitations.expiryDateQuestion")}
                                     info={I18n.t("invitations.expiryDateInfo")}
                                     last={true}
                        />

                        {customExpiryDate &&
                            <DateField value={invitation.expiryDate}
                                       onChange={e => setInvitation({...invitation, expiryDate: e})}
                                       showYearDropdown={true}
                                       pastDatesAllowed={config.pastDateAllowed}
                                       minDate={futureDate(1)}
                                       maxDate={futureDate(30)}
                                       name={I18n.t("invitations.expiryDate")}
                                       toolTip={I18n.t("tooltips.expiryDateTooltip")}/>}

                    </div>}
                <section className="actions">
                    <Button type={ButtonType.Secondary}
                            txt={I18n.t("forms.cancel")}
                            onClick={() => navigate(-1)}/>
                    <Button disabled={disabledSubmit}
                            txt={I18n.t("invitations.invite")}
                            onClick={submit}/>
                </section>


            </>
        );
    }

    if (loading) {
        return <Loader/>
    }
    const isInviter = highestAuthority(user) === AUTHORITIES.INVITER;
    return (
        <div className={"mod-invitation-form"}>
            <UnitHeader
                obj={({
                    name: I18n.t(`invitations.${guest ? "newGuest" : "new"}`),
                    svg: UserIcon,
                    style: "small"
                })}/>
            <div className={"invitation-form"}>
                {renderForm(isInviter)}
            </div>
        </div>
    );
}