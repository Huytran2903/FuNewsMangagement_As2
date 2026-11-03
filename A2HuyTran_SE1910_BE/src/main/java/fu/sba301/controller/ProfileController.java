package fu.sba301.controller;

import fu.sba301.dto.ProfileDTO;
import fu.sba301.security.CustomUserDetails;
import fu.sba301.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getProfile(userDetails.getAccountID()));
    }

    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @Valid @RequestBody ProfileDTO dto) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getAccountID(), dto));
    }
}
