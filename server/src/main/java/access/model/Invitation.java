package access.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.CollectionUtils;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.Period;
import java.util.*;

@Entity(name = "invitations")
@NoArgsConstructor
@Getter
@Setter
public class Invitation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "intended_authority")
    private Authority intendedAuthority;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column
    private String email;

    @Column
    private String message;

    @Column
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String hash;

    @Column(name = "enforce_email_equality")
    private boolean enforceEmailEquality;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "expiry_date")
    private Instant expiryDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inviter_id")
    @JsonIgnore
    private User inviter;

    @OneToMany(mappedBy = "invitation", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<InvitationRole> roles = new HashSet<>();

    @Transient
    private boolean emailEqualityConflict = false;

    public Invitation(Authority intendedAuthority, String hash, String email, boolean enforceEmailEquality, User inviter, Set<InvitationRole> roles) {
        this.intendedAuthority = intendedAuthority;
        this.hash = hash;
        this.enforceEmailEquality = enforceEmailEquality;
        this.inviter = inviter;
        this.status = Status.OPEN;
        this.roles = roles;
        this.email = email;
        roles.forEach(role -> role.setInvitation(this));
        this.defaults();
    }

    public void defaults() {
        this.expiryDate = Instant.now().plus(Period.ofDays(14));
        this.createdAt = Instant.now();
    }

    @JsonIgnore
    public void addInvitationRole(InvitationRole role) {
        this.roles.add(role);
        role.setInvitation(this);
    }

    //used in the mustache templates
    @JsonIgnore
    public List<String> anyRoles() {
        return CollectionUtils.isEmpty(this.roles) ? Collections.emptyList() : Arrays.asList("will-iterate-once");
    }

    @JsonProperty(value = "inviter", access = JsonProperty.Access.READ_ONLY)
    public Map<String, String> getInviterEmail() {
        User inviter = this.getInviter();
        return inviter != null ? Map.of("email", inviter.getEmail(), "name", inviter.getName()) : Collections.emptyMap();
    }

}
