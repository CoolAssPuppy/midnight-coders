"use client";

import { useState } from "react";
import Image from "next/image";
import { BuyTheBook } from "@/components/BuyTheBook";

type ReadingMode = "dark" | "light";

export function ExcerptReader(): React.ReactElement {
  const [mode, setMode] = useState<ReadingMode>("dark");

  const isDark = mode === "dark";

  const bgColor = isDark ? "#0a1628" : "#f5f5f0";
  const textColor = isDark ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.85)";
  const mutedColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.55)";
  const alertColor = isDark ? "#d22729" : "#b91c1c";
  const accentColor = isDark ? "rgba(78, 201, 176, 0.3)" : "rgba(78, 201, 176, 0.5)";
  const dotColor = "#4EC9B0";
  const toggleBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const toggleText = isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.35)";

  return (
    <div
      className="transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header -- stays dark regardless of reading mode */}
      <div
        className="pt-24 pb-10 md:pt-32 md:pb-14 text-center px-6"
        style={{
          background: "linear-gradient(180deg, #0e1f3a 0%, #0a1628 100%)",
        }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] mb-3"
          style={{ color: dotColor, fontFamily: "var(--font-mono)" }}
        >
          CHAPTER 1
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{
            color: "#fff",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          5:43 a.m.
        </h1>
        <p
          className="text-xs"
          style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-mono)" }}
        >
          from <em>The Midnight Coder&apos;s Children</em> by Prashant
          Sridharan
        </p>
      </div>

      {/* Reading surface */}
      <div className="relative px-6 py-10 md:py-16">
        {/* Toggle */}
        <div className="max-w-[640px] mx-auto mb-8 flex justify-end">
          <button
            onClick={() => setMode(isDark ? "light" : "dark")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase transition-colors duration-300"
            style={{
              backgroundColor: toggleBg,
              color: toggleText,
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>

        <article className="max-w-[640px] mx-auto">
          <div
            className="text-base md:text-[17px] leading-[1.9] space-y-5 transition-colors duration-500"
            style={{
              color: textColor,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <p>
              Sydney McEnroe speedwalked off the 3 Train and sprinted up the
              stairs two at a time. Upon reaching the top, she lowered her head
              and started running. Her phone buzzed in the pocket of her navy
              blue pantsuit, but she kept running. She could feel her legs from
              this weekend&apos;s training, but she kept running. Her lungs were
              stinging from the cold February air, but she kept running.
            </p>

            <p>
              She arrived at the venerable JR Eastman building in Wall Street at
              5:45 a.m., nineteen minutes earlier than usual. She flashed her
              badge at the night watchman.
            </p>

            <p>
              The elevator crawled to the 57th floor. She paced, tapped her
              feet, rolled her neck, snapped her fingers against her thigh.
              Finally, the doors splayed open and she sprinted through the
              still-dark hallway, overhead fluorescent lights blooming and dying
              in her wake.
            </p>

            <p>
              Upon entering her glass-enclosed office, the lights turned on and
              the computer monitor came to life. She dropped her gym bag on the
              floor and kicked it under the guest chair in the corner. Commuter
              sneakers off. Work heels on.
            </p>

            <p>
              The espresso machine in the corner turned on. She looked at her
              watch. Exactly 5:50 a.m. From the pocket of her trenchcoat she
              retrieved a 250-gram bag of Yirgacheffe Ethiopian coffee beans and
              threw it on the desk. Coffee would have to wait. She peeled off
              her trenchcoat and tossed it onto the guest chair.
            </p>

            <p>
              She pulled her phone out. The screen displayed a cascade of
              frantic messages, each decorated with a red stop sign, yellow
              triangle, or red siren.
            </p>

            <p>Each ping, another piece of bad news.</p>

            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: alertColor, fontFamily: "var(--font-mono)" }}
            >
              System breach at the core level!
            </p>

            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: alertColor, fontFamily: "var(--font-mono)" }}
            >
              Transactions frozen!
            </p>

            <p
              className="text-sm font-semibold tracking-wide"
              style={{ color: alertColor, fontFamily: "var(--font-mono)" }}
            >
              Authorization protocols failing.
            </p>

            <p>
              Her body registered the threat before her mind could process
              it -- pulse spiking, breath going shallow, the familiar tightness
              behind her sternum that meant the system was under load. She&apos;d
              spent a year hardening this infrastructure, stress-testing every
              node, running failure scenarios until three in the morning.
              She&apos;d made it hers. And now someone had walked right through
              the walls she&apos;d built.
            </p>

            <p>
              Carla Hughes popped her head over her cubicle wall and locked eyes
              with Sydney from halfway across the floor. She pointed to the
              stairs, indicating she&apos;d run downstairs to confirm what was
              happening.
            </p>

            <p>
              Sydney knew who would be in early -- Carla, always at 5:40, except
              on Thursdays, and Jimmy Raglan, who arrived at 6:05 after CrossFit
              but pretended it was 6:00. She knew who had school dropoff and
              mentally filed when they&apos;d walk in the door. She knew who
              left early for yoga class. She knew who stayed late to meet up
              with friends on Thursdays. She had to know who she could count on.
            </p>

            <p>
              If her hunch was correct, this would be the team she would need to
              count on today. They had barely a year together and she wasn&apos;t
              sure about them yet.{" "}
              <em>Don&apos;t let me down.</em> The thought
              surprised her. She wasn&apos;t sure if she meant them or herself.
            </p>

            <p>
              Another text. Lina. The preview: &ldquo;You left
              without...&rdquo;
            </p>

            <p>
              Sydney&apos;s thumb hovered for a half-second. She could see the
              shape of the sentence Lina was writing -- the hurt, the confusion,
              the morning they were supposed to have before everything went
              sideways. She swiped it away. Filed it mentally under
              &ldquo;later.&rdquo; The same folder where she&apos;d been filing
              Lina for months now, the one that never seemed to empty no matter
              how many times she promised herself she&apos;d get to it.
            </p>

            <p>
              She looked through the glass walls at the rest of her team in
              their cubicles. One engineer was banging on his keyboard in a
              futile attempt to coax his terminal window into action. Another
              engineer kept trying the same command over and over and over.
              Beyond them she could see others trickling in and getting the
              panicked low-down from their teammates.
            </p>

            <p>
              Sydney wiped her damp palms on her blouse, her slacks. She closed
              her eyes, inhaled, and held her breath for a count of four. She
              pressed her palms forcefully onto the table top. When that failed
              to calm her nerves, she fell into her chair. This wasn&apos;t a
              drill. This was the plan for when the plan failed.
            </p>

            <p>She opened her laptop and tried to look at her dashboard. Failure.</p>

            <p>
              She opened a terminal window and rebased the bank&apos;s code. She
              tried to run a version of the bank&apos;s software locally.
              Failure.
            </p>

            <p>
              She tried to log into the database, the heart of the bank.
              Failure.
            </p>

            <p>The bank was down.</p>

            <p>
              Four trillion dollars in assets under management. Hundreds of
              billions in transactions every day. Tens of millions of accounts.
              All down.
            </p>

            <p>
              She closed her laptop. For an eternal few seconds she went through
              all the possibilities. They kept pointing to one thing. Only one
              thing. She wasn&apos;t one for prayer, but had she been, she
              would&apos;ve prayed it wasn&apos;t the case.
            </p>

            <p>
              From within her desk, she retrieved a red three-ring binder. Her
              hand lingered on the binder a beat too long. She could feel her
              pulse in the joints of her fingers.
            </p>

            <p>
              The binder was twenty-six years old. Its edges were frayed and
              held together with duct tape. The middle ring closed slightly
              askew. She started it on September 11, 2001. The horrors of that
              day led to writing her first contingency plan in the margins of a
              fifth grade math worksheet. Since, the binder contained detailed
              accounts of stairwells, exits, and impossible, unimaginable
              scenarios, all geared to satisfying a particular longing: to be
              prepared at all times for all things.
            </p>

            <p>Now, the fear wasn&apos;t theoretical. It had breached the perimeter.</p>

            <p>
              She flung the binder open. Within it were several tabbed sheets
              printed on heavy card stock. She flipped past
              &ldquo;Terrorists&rdquo; and &ldquo;Hostage Crisis&rdquo; to the
              one labeled &ldquo;Hack.&rdquo; She sat in her chair, adjusted
              her jacket, and cleared her throat.
            </p>

            <p>
              The first item on the checklist was, simply,
              &ldquo;Breathe.&rdquo;
            </p>

            <p>She did as she instructed herself to do.</p>

            <p>
              The second item was &ldquo;Notify the Secret Service and
              FBI.&rdquo; Phone numbers were printed next to each, along with a
              name of Special Agents in each organization.
            </p>

            <p>&ldquo;Melanie!&rdquo; she called.</p>

            <p>
              A middle-aged woman in a gray, ankle-length tweed skirt and neatly
              pressed pink blouse appeared in her doorway, her Moleskine
              reporter&apos;s notebook and blue pen at the ready. Melanie,
              always prepared.
            </p>

            <p>
              &ldquo;I need you to contact the Secret Service and FBI. Tell
              them it&apos;s me and that I am calling for a Trident
              Period.&rdquo; She scribbled names and phone numbers on a yellow
              Post-It and handed them to Melanie.
            </p>

            <p>
              Sydney had pre-loaded contacts at all federal agencies with their
              own checklists. She had carefully selected members of both
              organizations&apos; financial task forces who were as particular
              and professional as she was. Cultivating relationships with
              intense people who got shit done -- Melanie included -- was her
              specialty.
            </p>

            <p>
              Sydney&apos;s counterparts in the government would know what the
              &ldquo;trident&rdquo; codeword meant: the tip of the spear, the
              most salient -- and dangerous -- thing. She expected an FBI
              Supervisory Special Agent from the Cyber Division at JR Eastman
              headquarters within the next half-hour, and together, the two of
              them would join the CEO immediately after arrival.
            </p>

            <p>
              She closed her eyes and then clapped her hands. Melanie knew the
              tell and had her pen positioned to write.
            </p>

            <p>
              &ldquo;Tell Carla and Jimmy we are in Trident. Call an All-Hands.
              I want to address everyone within the next fifteen minutes. Notify
              any non-engineer and non-analyst at home or en route not to come
              into the office today unless I specifically ask for them. Notify
              security and everyone here that we are at stage one lockdown. Step
              away from computers, turn off phones. Literally, turn them off.
              And -- &rdquo;
            </p>

            <p>
              &ldquo;No one leaves the building.&rdquo; Melanie, always a step
              ahead.
            </p>

            <p>
              &ldquo;And no one leaves the building. And tell Paul I&apos;m
              coming to see him.&rdquo; She tapped the page with her hand.
              &ldquo;And get me IT.&rdquo;
            </p>

            <p>Melanie nodded and left. The Trident Plan was in motion.</p>

            {/* Section break */}
            <SectionBreak accentColor={accentColor} dotColor={dotColor} />

            <p>
              Binder in-hand, Sydney bounded up six flights, skipping every
              other step. She felt burning in her legs as the nexus of weekend
              marathon training and her thirty-something years on the planet
              conspired against her. Thirty-seven was not twenty-seven.
            </p>

            <p>
              Paul&apos;s assistant held up a finger as she approached. Through
              the glass, she could see him on the phone, pacing behind his desk.
              She waited.
            </p>

            <p>
              The walls of his reception area were lined with photographs. Paul
              shaking hands with two presidents. Paul ringing the opening bell
              at the stock exchange. Paul at a ribbon-cutting in Des Moines, his
              hometown, where he&apos;d grown up in a house smaller than this
              waiting room. He liked that story. Told it often -- at town halls,
              in interviews, to new hires who needed to understand that JR
              Eastman was a meritocracy.{" "}
              <em>Bootstraps. Job creators.</em> Words he used so
              frequently they&apos;d lost all meaning, if they&apos;d ever had
              any.
            </p>

            <p>
              She&apos;d heard the speech at her own interview. Had believed it,
              mostly. Still did, some days.
            </p>

            <p>
              Paul&apos;s assistant caught her eye and nodded toward the door.
              Paul had hung up.
            </p>

            <p>
              &ldquo;What is the situation?&rdquo; he asked once she entered.
            </p>

            <p>
              She noticed his computer was off, and the Ethernet was
              disconnected from the wall. On his desk sat his two new iPhones,
              each turned off -- and without cases, as only the rich and carefree
              were wont to do. A box with a Motorola burner phone was unopened
              and on the credenza behind the desk.
            </p>

            <p>
              He waved a laminated checklist she&apos;d given him ages ago.
              &ldquo;I do listen, you know.&rdquo;
            </p>

            <p>She almost smiled. Almost.</p>

            <p>
              &ldquo;Secret Service and FBI are on the way. Lockdown is in
              effect. We don&apos;t know who or what, but we should have clues
              soon. Carla&apos;s in the data room. Jimmy will sweep the logs as
              soon as he gets in. We have people in Finance auditing the balance
              sheets. Everyone&apos;s moving.&rdquo;
            </p>

            <p>&ldquo;Hypotheses?&rdquo;</p>

            <p>
              &ldquo;State-sponsored? Could be Lazarus, like Bangladesh. A bit
              early to know for sure. But this isn&apos;t amateurs. It&apos;s
              precise. Like MGM, but sharper.&rdquo;
            </p>

            <p>&ldquo;Next steps?&rdquo; Paul asked.</p>

            <p>
              Sydney nodded towards the laminated card. &ldquo;We work the
              problem.&rdquo;
            </p>

            <p>
              &ldquo;I pay you to make sure this doesn&apos;t happen.&rdquo; He
              was at the window now, watching the city awaken below. Slowly, he
              turned to face her -- six feet of Iowa corn-fed bulk in a suit that
              cost more than her first car, silver hair cropped close, the jaw
              of a man who&apos;d played linebacker at a state school before
              discovering that finance paid better. His eyes were the pale blue
              of a winter sky, and just as warm. &ldquo;And here we are.&rdquo;
            </p>

            <p>
              Sydney met his gaze and held it. &ldquo;We work the
              problem.&rdquo;
            </p>

            <p>He waved her off. &ldquo;Go.&rdquo;</p>

            {/* Section break */}
            <SectionBreak accentColor={accentColor} dotColor={dotColor} />

            <p>
              Back at her office, the troops had gathered. &ldquo;Your FBI
              contact is 6 minutes out,&rdquo; Melanie said, handing Sydney a
              microphone. &ldquo;An FBI Cyber Action Team has been activated.
              They say they should be up and running within an hour.&rdquo;
            </p>

            <p>
              Sydney climbed onto a desk in the middle of the cubicle farm.
              Forty faces looked up at her. Maybe fifty. She&apos;d hired maybe
              half of them. Inherited the rest. She knew their strengths, their
              blind spots. In some cases, she knew -- and judged -- their coding
              style. She had yet to see the ways they each handled the pressure.
              She knew that half of them had never seen a real attack.
              They&apos;d run drills. They&apos;d studied case files. But this
              was different. This was the thing itself.
            </p>

            <p>
              Out of the corner of her eye, she saw Carla shaking her head, arms
              crossed in an X -- the signal they&apos;d established months ago.
              Not ready. Don&apos;t start yet. Sydney gave her a quick nod.
              Carla held up five fingers, then pointed to the back of the room
              where two engineers were still making their way in from the
              elevators.
            </p>

            <p>
              Sydney waited. She&apos;d learned that from Carla, actually. Her
              first week at the bank, she&apos;d launched into a crisis briefing
              before half the team had arrived, and Carla had pulled her aside
              afterward. &ldquo;You only get one chance to set the tone,&rdquo;
              she&apos;d said. &ldquo;Make sure everyone&apos;s in the room to
              hear it.&rdquo; Sydney had bristled at the time. Now she
              understood.
            </p>

            <p>Carla dropped her arms and nodded. Go.</p>

            <p>
              Sydney tapped the microphone. &ldquo;Team, as you can tell,
              almost ninety minutes ago, we were attacked and hacked. Whoever
              did this is as sophisticated as they get. Our trading systems are
              currently down.&rdquo; She cleared her throat. In the back, a thin
              woman with fashionable glasses and a primly pressed white blouse
              signaled thumbs-up. &ldquo;Cash and cash reserves are
              safe,&rdquo; she went on, &ldquo;and no securities have been
              transferred in or out. Markets don&apos;t open for a while yet, so
              the full effect of our systems being down hasn&apos;t quite
              trickled out to the rest of the company.&rdquo;
            </p>

            <p>
              She scanned the room. Some faces she recognized from late nights
              and weekend deployments -- the ones who showed up when things broke.
              Others she knew only from org charts and performance reviews. Right
              now, they were all looking at her the same way: waiting to be told
              what to do. That was the job. Not fixing the problem herself.
              Making sure everyone else could.
            </p>

            <p>
              She motioned to the elevators. &ldquo;Our systems are generally
              hardened, but the many connected building systems may not be. We
              all know what happened at MGM. I advise using the stairs until we
              have the time to audit and secure those systems, simply as a
              precaution. Until we know the particular attack vectors, your
              phones must remain off. Your managers have burner phones in their
              desks that you can use to contact your loved ones, if
              necessary.&rdquo;
            </p>

            <p>
              A murmur rippled through the room. Phones off. That was when it
              became real for most people. Not the trading systems, not the
              network diagrams -- the moment they couldn&apos;t text their kids or
              check on their parents. Sydney understood. She&apos;d felt the
              weight of her own phone in her pocket, the unanswered message from
              Lina still sitting there.
            </p>

            <p>
              &ldquo;So far, that&apos;s what we do know. What we don&apos;t
              know is who caused this or what they intend to do next. We
              don&apos;t know if this is an advanced persistent threat and how
              long it has been lurking in our systems. We don&apos;t know what
              data has been compromised and why they haven&apos;t touched the
              money. For that, it&apos;s all hands on deck. Jimmy is going to
              start assembling the full logs of all our systems dating back to a
              year ago. We will start poring through these as a team. We are
              looking for anomalous activity. You&apos;ll know it when you see
              it.&rdquo;
            </p>

            <p>
              Sydney gave it a beat and looked around the room to ensure all
              eyes were on her before continuing. She looked at Carla, who gave
              her a small nod. Almost done. Bring it home.
            </p>

            <p>
              &ldquo;We are in the middle of a high-tech bank heist and we
              don&apos;t know if the robbers are still in the building. You all
              know your jobs. We&apos;ve trained for this. Let&apos;s
              go.&rdquo;
            </p>

            {/* Section break */}
            <SectionBreak accentColor={accentColor} dotColor={dotColor} />

            <p>
              Melanie motioned Sydney to the stairs, and Sydney began the
              fifty-seven-story descent to the lobby. Melanie followed
              dutifully behind, carrying the red binder and her Moleskine
              notebook. As they moved down the stairwell, Sydney fired off
              orders that Melanie captured without breaking stride. &ldquo;Put
              someone in charge of briefing people as they come into
              work.&rdquo; &ldquo;Make sure Carla and Jimmy are with me in
              emergency staff.&rdquo; And so on, as ideas popped into her head.
            </p>

            <p>
              In return, Sydney received an avalanche of Slack messages from her
              team giving her real-time information on progress. She nearly
              tripped on floor 31, but she recovered quickly and kept sending
              orders and receiving information.
            </p>

            <p>Her phone buzzed again. Lina. She silenced it without looking.</p>

            <p>
              Upon entering the lobby, an athletic woman in a black pantsuit
              waited for her. Sydney passed through the exit gates towards her
              with Melanie in tow.
            </p>

            <p>
              JR Eastman occupied the upper 40 floors of the 63-story JR
              Eastman building on Liberty Street in Manhattan. The building
              itself was an architectural marvel, a glass and steel paean to the
              butterfly, and it never failed to strike Sydney with awe.
            </p>

            <p>
              The cavernous lobby was usually full of busy New Yorkers coming and
              going with purpose, but now, with the new security protocols, the
              lobby line stretched to the revolving doors. Sydney counted heads.
              Forty-three people waiting. By eight o&apos;clock, it would be
              four hundred.
            </p>

            <p>&ldquo;Special Agent Torres.&rdquo;</p>

            <p>
              Sydney shook her hand and introduced her to Melanie. &ldquo;This
              way, please, Agent Torres. We are all in the basement.&rdquo;
            </p>

            <p>
              She badged through the gate readers to an armed security guard
              waiting on the other side, then reached into her wallet to produce
              her New York State Driver&apos;s License. Agent Torres followed
              behind, showing her government-issued badge and presenting
              secondary identification.
            </p>

            <p>&ldquo;We are in lockdown,&rdquo; said Sydney.</p>

            <p>
              Once the agent was cleared through security, Sydney motioned her
              towards the elevators and offered to brief her on the way.
            </p>

            <p>
              The three of them continued into the main entrance of the bank,
              past the oak-paneled elevator bay, to a barely visible door that
              opened inward with a light touch. They took four flights of stairs
              down and were greeted by scruffy Jimmy Raglan, who regularly
              delighted in flaunting the corporate dress code as only a West
              Coast born-and-bred engineer could.
            </p>

            <p>
              Jimmy&apos;s hair was wet from his workout, and he was fumbling
              with his tie with one hand and trying to type with the other. He
              noted Sydney&apos;s arrival and without fanfare gave her his
              rundown. &ldquo;No physical breach. However they got in, they
              didn&apos;t do it from outside the building. At least not
              today,&rdquo; he said. &ldquo;We are still auditing the logs
              further back and should have more in the next couple of hours.
              So -- &rdquo;
            </p>

            <p>
              &ldquo;So we&apos;re looking at a long-dormant
              intrusion,&rdquo; Sydney said. &ldquo;Probably months. Maybe
              longer.&rdquo;
            </p>

            <p>
              Jimmy blinked. &ldquo;I was going to say -- yeah. That&apos;s
              probably right.&rdquo;
            </p>

            <p>
              Sydney caught herself. She&apos;d done it again. Finished his
              sentence. Jumped to his conclusion before he could reach it. She
              made herself wait.
            </p>

            <p>&ldquo;Are you prepared to brief?&rdquo;</p>

            <p>He hesitated.</p>

            <p>She didn&apos;t repeat the question. She waited.</p>

            <p>
              Jimmy&apos;s fingers paused over the keyboard. A flicker of
              something -- checking her face, maybe gauging how much detail she
              wanted. &ldquo;With whatever information I have now. It&apos;s not
              much, but it will do.&rdquo;
            </p>

            <p>
              Sydney nodded as everyone entered the subbasement boardroom.
            </p>

            <p>
              The Bunker was four floors below the lobby. Windowless.
              Faraday-caged, if necessary. The kind of room that made you forget
              sunlight existed. It smelled like a damp parking garage. Every
              inch of the three walls was empaneled with television monitors.
            </p>

            <p>
              Today, the Bunker was full of the company&apos;s principal legal,
              public relations, and engineering managers.
            </p>

            <p>
              Paul entered soon after everyone was seated. He touched shoulders,
              remembered names, made everyone feel seen. Sydney watched him work
              the room and sensed he was . . . not angry, exactly, but
              exhausted.
            </p>

            <p>
              He was good at this. The people part. The part where leaders make
              people feel comfortable coming to work.
            </p>

            <p>
              Sydney started. &ldquo;We can rule out physical breaches, at least
              in the time period immediately before today. We can get the
              elevators moving and you can use your phones again.&rdquo;
            </p>

            <p>
              After summarizing the remainder of the situation, Sydney motioned
              for the room to provide input. Jimmy started speaking, tie in
              hand. He flopped the knotted mess on the table in front of him.
            </p>

            <p>
              &ldquo;We&apos;ve definitely got a long-running, possibly
              long-dormant, malicious actor in our system,&rdquo; he said as he
              plugged in his laptop and projected Java computer code on the
              screen. He highlighted a section. &ldquo;This code was executed at
              4:23 this morning. It caused four databases to effectively become
              inaccessible. It changed access credentials to the databases and
              locked our programming logic from accessing data.&rdquo;
            </p>

            <p>
              &ldquo;Jesus. Is our code safe now?&rdquo; Paul asked.
            </p>

            <p>
              &ldquo;You remember six months ago, we went through that full
              security audit?&rdquo; Jimmy said. &ldquo;Nobody wanted to do it,
              but it turns out it was kinda useful. The auditor recommended that
              we implement multi-factor authentication for all privileged
              accounts. We rolled it out last August during the slow summer
              months. Since we had superuser privileges locked down by physical
              Yubikeys, I was able to get in and reset the compromised
              credentials.&rdquo;
            </p>

            <p>
              Sydney leaned forward. &ldquo;What about the databases
              themselves?&rdquo;
            </p>

            <p>
              &ldquo;That&apos;s where it gets messy,&rdquo; Jimmy said,
              pulling up terminal windows on his laptop. &ldquo;Right now, we
              only have read access to the database. We are locked out from
              using it for anything meaningful. I tried restoring from our most
              recent clean backup, but the malware has persistence mechanisms.
              It reinfects the moment we try to restore write
              access.&rdquo;
            </p>

            <p>
              &ldquo;Restore from cold storage backups?&rdquo; Paul asked.
            </p>

            <p>
              &ldquo;Already tried in a sandbox environment,&rdquo; Jimmy said,
              highlighting infected code on his screen. &ldquo;Whatever this
              thing is, it&apos;s got hooks deep in the database layer. Probably
              embedded in stored procedures or triggers that execute
              automatically. Kind of like Bangladesh Bank or the Maggie backdoor
              from a while back. It&apos;s hard to say when it was introduced,
              but it&apos;s in all the backups through at least four years ago.
              That&apos;s as far as I got before coming down here.&rdquo;
            </p>

            <p>
              Carla shook her head. &ldquo;The databases are going to be our
              biggest problem. Even if we&apos;ve cleaned the application layer,
              there&apos;s likely a payload sitting dormant in the data
              itself -- &rdquo;
            </p>

            <p>
              &ldquo;Waiting to reactivate,&rdquo; Sydney finished.
            </p>

            <p>Carla tipped her head in agreement.</p>

            <p>
              &ldquo;So the question is how we get clean data when we
              can&apos;t trust the backups.&rdquo;
            </p>

            <p>
              Paul rubbed his temples. &ldquo;So our application code is secure,
              but our data is poisoned. How do we restore the database, and how
              do we prevent this from happening again?&rdquo;
            </p>

            <p>
              &ldquo;That,&rdquo; Carla said grimly, &ldquo;is the
              billion-dollar question.&rdquo;
            </p>

            <p>
              &ldquo;Our top priority is to answer your first
              question,&rdquo; Sydney said, &ldquo;about restoring the
              database. As for preventing it, we are going to need FBI and
              Secret Service help.&rdquo; She motioned towards Agent Torres.
              &ldquo;Without knowing who did it, it&apos;s hard to figure out
              how.&rdquo;
            </p>

            <p>
              &ldquo;The way our system is built,&rdquo; Jimmy added,
              &ldquo;is that our codebase is in a repository that&apos;s
              available to the company. We effectively separated the code that
              runs the bank from the database that contains all the user data.
              We have secured the codebase, though we&apos;re running another
              audit on those systems to make sure no one who wasn&apos;t
              authorized to read the data got it. This means that it could have
              been anyone in the company.&rdquo;
            </p>

            <p>
              &ldquo;We should start by getting a list of everyone who has ever
              had access to your code,&rdquo; Agent Torres said.
              &ldquo;Sometimes people give things away without knowing what
              they&apos;re giving or even to whom.&rdquo;
            </p>

            <p>
              Sydney motioned to Melanie, who flashed a thumbs-up.
              &ldquo;You&apos;ll have it within the hour,&rdquo; she said as
              she typed a message on her phone.
            </p>

            <p>
              &ldquo;The other thing I can do is give your team access to all
              our backups,&rdquo; Jimmy added. &ldquo;If you find out when the
              malicious code was introduced, you could maybe narrow down who did
              it.&rdquo;
            </p>

            <p>
              Paul stood. &ldquo;Okay, we have two paths. Path one is figure
              out who did this. Admittedly, not likely to change the outcome or
              help us get back on our feet. But that&apos;s a criminal matter
              for the FBI.&rdquo;
            </p>

            <p>Torres nodded and took notes.</p>

            <p>
              &ldquo;The second path, and the more pressing matter,&rdquo; Paul
              went on, &ldquo;is what I want everyone at this institution
              focused on and that&apos;s getting access to the database, no
              matter what it takes.&rdquo;
            </p>

            <p>
              Jimmy put his index finger in the air. &ldquo;When I looked at
              access credentials earlier, I noticed something peculiar.&rdquo;
              He projected a different window to the screens around the room.
              &ldquo;Here&apos;s a table of all users who have access to the
              database and their level of access. You can also see timestamps of
              log-ins. Most of these rows are innocuous. Every software
              developer in the bank has read-only access privileges, while some
              have write privileges. But those write privileges do not grant
              sufficient access to change anyone else&apos;s access privileges.
              For that you need &lsquo;superuser&rsquo; privileges.&rdquo;
            </p>

            <p>
              &ldquo;I see two accounts there with &lsquo;superuser&rsquo;
              privileges,&rdquo; Sydney said.
            </p>

            <p>
              &ldquo;Yup, good eye. The &lsquo;admin&rsquo; account is the one
              that was hacked into this morning, as you can see from the
              timestamp. There&apos;s this other account we can&apos;t make
              sense of. An account named &lsquo;Gaya1973.&rsquo;&rdquo;
            </p>

            <p>
              &ldquo;Why would there be a second superuser account?&rdquo;
              Agent Torres asked.
            </p>

            <p>&ldquo;That&apos;s the question,&rdquo; replied Jimmy.</p>

            <p>
              Paul gasped. &ldquo;Holy shit.&rdquo; Everyone turned to face
              him. &ldquo;It&apos;s incredible that she&apos;d do this.&rdquo;
            </p>

            <p>&ldquo;Who?&rdquo; Sydney asked. &ldquo;Do what?&rdquo;</p>

            <p>
              &ldquo;Gayathri Ramaswamy,&rdquo; Paul said.
            </p>

            <p>
              &ldquo;A disaffected employee?&rdquo; Agent Torres asked.
            </p>

            <p>
              &ldquo;Hardly,&rdquo; Paul said. &ldquo;I was Gaya&apos;s intern
              when I started at the bank.&rdquo;
            </p>

            <p>
              Sydney asked who Gayathri Ramaswamy was at the same time Agent
              Torres asked,
            </p>

            <p>&ldquo;Are you sure she&apos;s not behind this?&rdquo;</p>

            <p>
              &ldquo;Gaya,&rdquo; Paul said, pausing as if processing a wave of
              memories. &ldquo;She&apos;s only the heart and soul of the bank.
              And, no, Agent Torres, she would never do anything to harm us. She
              loved working here almost as much as she loved her own
              children.&rdquo;
            </p>

            <p>
              &ldquo;Wait,&rdquo; Jimmy said. &ldquo;Is she the one in the
              engineering orientation video? The one that goes from how to check
              in code to what to do in the event of a nuclear attack within
              about thirty seconds?&rdquo;
            </p>

            <p>
              Paul almost smiled. &ldquo;We used to tease her about that video.
              She said we&apos;d thank her someday.&rdquo; He looked around the
              room. &ldquo;Turns out she was right.&rdquo;
            </p>

            <p>
              &ldquo;Why don&apos;t we just bring her in?&rdquo; Agent Torres
              asked.
            </p>

            <p>
              &ldquo;You can&apos;t,&rdquo; Paul said, staring off into the
              distance. &ldquo;She died years ago.&rdquo;
            </p>
          </div>
        </article>

        {/* Footer */}
        <div className="max-w-[640px] mx-auto mt-16 pb-8 flex flex-col items-center gap-4">
          <Image
            src="/images/midnight-coders-logotype.svg"
            alt="The Midnight Coder's Children"
            width={60}
            height={60}
            className="h-[60px] w-auto"
            style={{ opacity: isDark ? 0.7 : 0.5 }}
          />
          <p
            className="text-xs tracking-wider text-center"
            style={{
              color: mutedColor,
              fontFamily: "var(--font-mono)",
            }}
          >
            The Midnight Coder&apos;s Children will be available September 2026
          </p>
        </div>

        {/* Buy the book */}
        <div className="max-w-[640px] mx-auto">
          <BuyTheBook />
        </div>
      </div>
    </div>
  );
}

function SectionBreak({
  accentColor,
  dotColor,
}: {
  accentColor: string;
  dotColor: string;
}): React.ReactElement {
  return (
    <div
      className="flex items-center justify-center gap-4 py-4"
      aria-hidden="true"
    >
      <span
        className="block w-16 h-px"
        style={{ backgroundColor: accentColor }}
      />
      <span
        className="block w-2 h-2 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      <span
        className="block w-16 h-px"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
