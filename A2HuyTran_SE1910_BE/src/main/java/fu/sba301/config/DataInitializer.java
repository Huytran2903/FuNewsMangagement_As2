package fu.sba301.config;

import fu.sba301.entity.Category;
import fu.sba301.entity.NewsArticle;
import fu.sba301.entity.SystemAccount;
import fu.sba301.entity.Tag;
import fu.sba301.repository.AccountRepository;
import fu.sba301.repository.CategoryRepository;
import fu.sba301.repository.NewsArticleRepository;
import fu.sba301.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AccountRepository accountRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository,
                           NewsArticleRepository newsArticleRepository,
                           PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Accounts if empty
        SystemAccount admin = accountRepository.findByAccountEmail("admin@funews.com").orElse(null);
        if (admin == null) {
            admin = new SystemAccount();
            admin.setAccountName("System Administrator");
            admin.setAccountEmail("admin@funews.com");
            admin.setAccountRole(1); // Admin
            admin.setAccountPassword(passwordEncoder.encode("admin123"));
            admin = accountRepository.save(admin);
        }

        SystemAccount staff = accountRepository.findByAccountEmail("staff@funews.com").orElse(null);
        if (staff == null) {
            staff = new SystemAccount();
            staff.setAccountName("Huy Tran Staff");
            staff.setAccountEmail("staff@funews.com");
            staff.setAccountRole(2); // Staff
            staff.setAccountPassword(passwordEncoder.encode("staff123"));
            staff = accountRepository.save(staff);
        }

        SystemAccount staff2 = accountRepository.findByAccountEmail("staff2@funews.com").orElse(null);
        if (staff2 == null) {
            staff2 = new SystemAccount();
            staff2.setAccountName("Nguyen Van B");
            staff2.setAccountEmail("staff2@funews.com");
            staff2.setAccountRole(2); // Staff
            staff2.setAccountPassword(passwordEncoder.encode("staff123"));
            staff2 = accountRepository.save(staff2);
        }

        // 2. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            Category academic = new Category(null, "Academic & Training", "Curriculum, exams, and academic announcements", null, true);
            academic = categoryRepository.save(academic);

            Category campus = new Category(null, "Campus Life", "Events, clubs, and extracurricular activities", null, true);
            campus = categoryRepository.save(campus);

            Category tech = new Category(null, "Technology & AI", "Research, innovations, and tech competitions", null, true);
            tech = categoryRepository.save(tech);

            Category sports = new Category(null, "Sports & Culture", "Athletics tournaments and cultural galas", campus, true);
            sports = categoryRepository.save(sports);

            Category archive = new Category(null, "Archive / Inactive Topics", "Obsolete topics kept for historical reference", null, false);
            categoryRepository.save(archive);
        }

        // 3. Seed Tags if empty
        if (tagRepository.count() == 0) {
            tagRepository.save(new Tag(null, "FPTU", "Official university updates"));
            tagRepository.save(new Tag(null, "Artificial Intelligence", "AI and machine learning news"));
            tagRepository.save(new Tag(null, "Student Life", "Club activities and campus life"));
            tagRepository.save(new Tag(null, "Scholarship", "Scholarships and grant opportunities"));
            tagRepository.save(new Tag(null, "Hackathon", "Coding and innovation challenges"));
        }

        // 4. Seed NewsArticles if empty
        if (newsArticleRepository.count() == 0) {
            Category academicCat = categoryRepository.findAll().stream()
                    .filter(c -> "Academic & Training".equals(c.getCategoryName()))
                    .findFirst().orElse(null);
            Category techCat = categoryRepository.findAll().stream()
                    .filter(c -> "Technology & AI".equals(c.getCategoryName()))
                    .findFirst().orElse(null);
            Category campusCat = categoryRepository.findAll().stream()
                    .filter(c -> "Campus Life".equals(c.getCategoryName()))
                    .findFirst().orElse(null);

            Tag fptuTag = tagRepository.findAll().stream().filter(t -> "FPTU".equals(t.getTagName())).findFirst().orElse(null);
            Tag aiTag = tagRepository.findAll().stream().filter(t -> "Artificial Intelligence".equals(t.getTagName())).findFirst().orElse(null);
            Tag studentTag = tagRepository.findAll().stream().filter(t -> "Student Life".equals(t.getTagName())).findFirst().orElse(null);

            // Article 1 (Active)
            NewsArticle a1 = new NewsArticle();
            a1.setNewsArticleID("NA1001");
            a1.setNewsTitle("FPT University Hosts National AI Summit 2026");
            a1.setHeadline("Leading AI experts and students gather to showcase breakthrough models.");
            a1.setCreatedDate(LocalDateTime.now().minusDays(2));
            a1.setNewsContent("The National AI Summit 2026 brought together top researchers, engineers, and ambitious students at FPT University. The summit highlighted generative AI advancements and ethical applications across industries.");
            a1.setNewsSource("FPT University Press");
            a1.setCategory(techCat != null ? techCat : academicCat);
            a1.setNewsStatus(true); // Active
            a1.setCreatedBy(staff);
            Set<Tag> tags1 = new HashSet<>();
            if (fptuTag != null) tags1.add(fptuTag);
            if (aiTag != null) tags1.add(aiTag);
            a1.setTags(tags1);
            newsArticleRepository.save(a1);

            // Article 2 (Active)
            NewsArticle a2 = new NewsArticle();
            a2.setNewsArticleID("NA1002");
            a2.setNewsTitle("Fall 2026 Academic Orientation and Course Registration");
            a2.setHeadline("Guidance for all students enrolling in the Fall semester modules.");
            a2.setCreatedDate(LocalDateTime.now().minusDays(1));
            a2.setNewsContent("The Academic Department announces the commencement of semester registration. Students are requested to check their individual portals for course schedules and prerequisite requirements.");
            a2.setNewsSource("Academic Affairs Office");
            a2.setCategory(academicCat);
            a2.setNewsStatus(true); // Active
            a2.setCreatedBy(staff);
            Set<Tag> tags2 = new HashSet<>();
            if (fptuTag != null) tags2.add(fptuTag);
            a2.setTags(tags2);
            newsArticleRepository.save(a2);

            // Article 3 (Inactive - for testing public visibility restriction)
            NewsArticle a3 = new NewsArticle();
            a3.setNewsArticleID("NA1003");
            a3.setNewsTitle("Internal Draft: Upcoming Campus Renovation Schedule");
            a3.setHeadline("Confidential draft regarding facility modernization plans.");
            a3.setCreatedDate(LocalDateTime.now().minusHours(5));
            a3.setNewsContent("This is an unapproved internal draft plan regarding library and dining hall renovations. It must not be published to public viewers until final approval from the board.");
            a3.setNewsSource("Internal Planning Committee");
            a3.setCategory(campusCat != null ? campusCat : academicCat);
            a3.setNewsStatus(false); // Inactive!
            a3.setCreatedBy(staff);
            Set<Tag> tags3 = new HashSet<>();
            if (studentTag != null) tags3.add(studentTag);
            a3.setTags(tags3);
            newsArticleRepository.save(a3);
        }
    }
}
